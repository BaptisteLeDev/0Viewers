const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const TwitchStreamsService = require('./twitchStreams');

class CacheService {
    constructor() {
        this.cacheDir = path.join(__dirname, '../../cache');
        this.cacheFile = path.join(this.cacheDir, 'zero-streamers.json');
        this.twitchService = new TwitchStreamsService();
        this.cacheDurationMinutes = parseInt(process.env.CACHE_DURATION_MINUTES) || 10;
        this.isUpdating = false;
    }

    /**
     * Initialise le service de cache
     */
    async initialize() {
        try {
            // Créer le dossier cache s'il n'existe pas
            await this.ensureCacheDirectory();
            
            // Charger les données initiales
            await this.loadInitialData();
            
            // Démarrer le cron job pour le rafraîchissement automatique
            this.startAutoRefresh();
            
            console.log('✅ Service de cache initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du cache:', error.message);
            throw error;
        }
    }

    /**
     * Assure que le dossier cache existe
     */
    async ensureCacheDirectory() {
        try {
            await fs.access(this.cacheDir);
        } catch (error) {
            await fs.mkdir(this.cacheDir, { recursive: true });
            console.log('📁 Dossier cache créé');
        }
    }

    /**
     * Charge les données initiales (depuis le cache ou depuis l'API)
     */
    async loadInitialData() {
        try {
            const cachedData = await this.getCachedData();
            
            if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                console.log('📄 Données chargées depuis le cache');
                return cachedData.data;
            } else {
                console.log('🔄 Cache invalide ou inexistant, récupération depuis l\'API...');
                return await this.refreshCache();
            }
        } catch (error) {
            console.error('⚠️ Erreur lors du chargement initial, récupération depuis l\'API...');
            return await this.refreshCache();
        }
    }

    /**
     * Récupère les données mises en cache
     * @returns {Promise<Object|null>} Données du cache ou null si inexistant
     */
    async getCachedData() {
        try {
            const data = await fs.readFile(this.cacheFile, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    }

    /**
     * Vérifie si le cache est encore valide
     * @param {string} timestamp - Timestamp de création du cache
     * @returns {boolean} true si le cache est valide
     */
    isCacheValid(timestamp) {
        if (!timestamp) return false;
        
        const cacheTime = new Date(timestamp);
        const now = new Date();
        const diffMinutes = (now - cacheTime) / (1000 * 60);
        
        return diffMinutes < this.cacheDurationMinutes;
    }

    /**
     * Rafraîchit le cache en récupérant de nouvelles données
     * @returns {Promise<Array>} Nouvelles données
     */
    async refreshCache() {
        if (this.isUpdating) {
            console.log('🔄 Mise à jour déjà en cours, attente...');
            // Attendre que la mise à jour en cours se termine
            while (this.isUpdating) {
                await this.delay(1000);
            }
            // Retourner les données du cache après la mise à jour
            const cachedData = await this.getCachedData();
            return cachedData ? cachedData.data : [];
        }

        this.isUpdating = true;
        
        try {
            console.log('🔄 Rafraîchissement du cache en cours...');
            
            const streams = await this.twitchService.processStreams();
            
            const cacheData = {
                timestamp: new Date().toISOString(),
                count: streams.length,
                data: streams
            };

            await fs.writeFile(this.cacheFile, JSON.stringify(cacheData, null, 2));
            
            console.log(`✅ Cache rafraîchi: ${streams.length} streamers sauvegardés`);
            return streams;
            
        } catch (error) {
            console.error('❌ Erreur lors du rafraîchissement du cache:', error.message);
            
            // En cas d'erreur, essayer de retourner les données du cache existant
            const cachedData = await this.getCachedData();
            if (cachedData) {
                console.log('📄 Retour aux données en cache suite à l\'erreur');
                return cachedData.data;
            }
            
            throw error;
        } finally {
            this.isUpdating = false;
        }
    }

    /**
     * Récupère les streamers (depuis le cache ou rafraîchit si nécessaire)
     * @param {boolean} forceRefresh - Force le rafraîchissement même si le cache est valide
     * @returns {Promise<Array>} Liste des streamers
     */
    async getZeroStreamers(forceRefresh = false) {
        try {
            if (forceRefresh) {
                return await this.refreshCache();
            }

            const cachedData = await this.getCachedData();
            
            if (cachedData && this.isCacheValid(cachedData.timestamp)) {
                console.log('📄 Données servies depuis le cache');
                return cachedData.data;
            } else {
                console.log('🔄 Cache expiré, rafraîchissement...');
                return await this.refreshCache();
            }
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des streamers:', error.message);
            
            // En dernier recours, essayer de retourner les anciennes données du cache
            const cachedData = await this.getCachedData();
            if (cachedData) {
                console.log('📄 Retour aux anciennes données en cache');
                return cachedData.data;
            }
            
            return [];
        }
    }

    /**
     * Démarre le rafraîchissement automatique via cron
     */
    startAutoRefresh() {
        // Cron job toutes les X minutes (défini par CACHE_DURATION_MINUTES)
        const cronPattern = `*/${this.cacheDurationMinutes} * * * *`;
        
        cron.schedule(cronPattern, async () => {
            try {
                console.log(`⏰ Rafraîchissement automatique du cache (toutes les ${this.cacheDurationMinutes} minutes)`);
                await this.refreshCache();
            } catch (error) {
                console.error('❌ Erreur lors du rafraîchissement automatique:', error.message);
            }
        });

        console.log(`⏰ Rafraîchissement automatique programmé toutes les ${this.cacheDurationMinutes} minutes`);
    }

    /**
     * Récupère les informations sur le cache
     * @returns {Promise<Object>} Informations sur le cache
     */
    async getCacheInfo() {
        try {
            const cachedData = await this.getCachedData();
            
            if (!cachedData) {
                return {
                    exists: false,
                    valid: false,
                    count: 0,
                    lastUpdate: null,
                    nextUpdate: null
                };
            }

            const isValid = this.isCacheValid(cachedData.timestamp);
            const lastUpdate = new Date(cachedData.timestamp);
            const nextUpdate = new Date(lastUpdate.getTime() + this.cacheDurationMinutes * 60 * 1000);

            return {
                exists: true,
                valid: isValid,
                count: cachedData.count || 0,
                lastUpdate: lastUpdate.toISOString(),
                nextUpdate: nextUpdate.toISOString(),
                isUpdating: this.isUpdating
            };
        } catch (error) {
            return {
                exists: false,
                valid: false,
                count: 0,
                lastUpdate: null,
                nextUpdate: null,
                error: error.message
            };
        }
    }

    /**
     * Utilitaire pour ajouter un délai
     * @param {number} ms - Délai en millisecondes
     * @returns {Promise}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Retourne la dernière heure de rafraîchissement du cache
     * @returns {Date|null}
     */
    getLastRefreshTime() {
        return this.lastRefreshTime || null;
    }
}

module.exports = CacheService;