const axios = require('axios');
const TwitchAuthService = require('./twitchAuth');

/**
 * Service de gestion des streams Twitch
 * Récupère et traite les streams français avec peu de viewers
 * 
 * @class TwitchStreamsService
 * @author BaptisteLeDev
 * @version 1.0.0
 */
class TwitchStreamsService {
    /**
     * Crée une instance du service de streams Twitch
     */
    constructor() {
        this.authService = new TwitchAuthService();
        this.maxPages = parseInt(process.env.TWITCH_MAX_PAGES) || 100;
        this.streamsPerPage = 100; // Maximum par page selon l'API Twitch
        this.language = process.env.TWITCH_LANGUAGE || 'fr'; // Langue des streams à récupérer
    }

    /**
     * Récupère tous les streams avec pagination complète
     * Utilise l'API Twitch pour récupérer les streams en français
     * 
     * @async
     * @returns {Promise<Array>} Liste de tous les streams récupérés
     * @throws {Error} En cas d'erreur lors de la récupération
     */
    async getAllStreams() {
        console.log('🔄 Début de la récupération des streams Twitch...');
        
        const allStreams = [];
        let cursor = null;
        let pageCount = 0;

        try {
            const headers = await this.authService.getAuthHeaders();

            while (pageCount < this.maxPages) {
                console.log(`📄 Récupération de la page ${pageCount + 1}/${this.maxPages}...`);
                
                const params = {
                    first: this.streamsPerPage,
                    language: this.language
                };

                if (cursor) {
                    params.after = cursor;
                }

                const response = await axios.get('https://api.twitch.tv/helix/streams', {
                    headers,
                    params
                });

                const { data, pagination } = response.data;
                
                if (!data || data.length === 0) {
                    console.log('📄 Aucun stream supplémentaire trouvé, arrêt de la pagination');
                    break;
                }

                allStreams.push(...data);
                console.log(`📊 ${data.length} streams récupérés (Total: ${allStreams.length})`);

                // Vérifier s'il y a une page suivante
                if (!pagination || !pagination.cursor) {
                    console.log('📄 Fin de pagination atteinte');
                    break;
                }

                cursor = pagination.cursor;
                pageCount++;

                // Petit délai pour éviter le rate limiting
                if (pageCount < this.maxPages) {
                    await this.delay(100);
                }
            }

            console.log(`✅ Récupération terminée: ${allStreams.length} streams au total`);
            return allStreams;

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des streams:', error.response?.data || error.message);
            throw new Error('Impossible de récupérer les streams');
        }
    }

    /**
     * Filtre les streams selon les critères: durée > 10 minutes
     * 
     * @param {Array} streams - Liste des streams à filtrer
     * @returns {Array} Streams filtrés qui durent depuis plus de 10 minutes
     */
    filterStreams(streams) {
        console.log('🔍 Filtrage des streams...');
        console.log(`📊 Nombre total de streams à filtrer: ${streams.length}`);
        
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
        
        // Debug: compter les streams par viewer count
        const viewerCounts = {};
        streams.forEach(stream => {
            const count = stream.viewer_count;
            viewerCounts[count] = (viewerCounts[count] || 0) + 1;
        });
        
        console.log('📈 Distribution des viewer counts (échantillon):', Object.entries(viewerCounts)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .slice(0, 10) // Afficher les 10 premiers
            .map(([count, nb]) => `${count} viewers: ${nb} streams`)
            .join(', '));
        
        const filteredStreams = streams.filter(stream => {
            // Vérifier si démarré depuis plus de 10 minutes
            const startedAt = new Date(stream.started_at);
            const isOlderThan10Min = startedAt < tenMinutesAgo;
            
            return isOlderThan10Min;
        });

        console.log(`📊 ${filteredStreams.length} streams correspondent aux critères (démarrés depuis >10min)`);
        return filteredStreams;
    }

    /**
     * Récupère les informations détaillées des utilisateurs
     * @param {Array} streams - Streams dont on veut les infos utilisateur
     * @returns {Promise<Object>} Map des infos utilisateur par user_id
     */
    async getUsersInfo(streams) {
        if (streams.length === 0) return {};

        console.log('👤 Récupération des informations utilisateurs...');
        
        try {
            const headers = await this.authService.getAuthHeaders();
            const userIds = streams.map(stream => stream.user_id);
            
            // L'API Twitch accepte jusqu'à 100 IDs par requête
            const usersInfo = {};
            
            for (let i = 0; i < userIds.length; i += 100) {
                const batch = userIds.slice(i, i + 100);
                
                const response = await axios.get('https://api.twitch.tv/helix/users', {
                    headers,
                    params: {
                        id: batch
                    }
                });

                response.data.data.forEach(user => {
                    usersInfo[user.id] = {
                        login: user.login,
                        display_name: user.display_name,
                        profile_image_url: user.profile_image_url,
                        created_at: user.created_at,
                        description: user.description || ''
                    };
                });

                // Petit délai entre les requêtes
                if (i + 100 < userIds.length) {
                    await this.delay(100);
                }
            }

            console.log(`✅ Informations récupérées pour ${Object.keys(usersInfo).length} utilisateurs`);
            return usersInfo;

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des infos utilisateurs:', error.response?.data || error.message);
            throw new Error('Impossible de récupérer les informations utilisateurs');
        }
    }

    /**
     * Récupère le nombre de followers pour chaque streamer
     * @param {Array} streams - Streams dont on veut le nombre de followers
     * @returns {Promise<Object>} Map du nombre de followers par user_id
     */
    async getFollowersCount(streams) {
        if (streams.length === 0) return {};

        console.log('👥 Récupération du nombre de followers...');
        
        try {
            const headers = await this.authService.getAuthHeaders();
            const followersCount = {};
            
            for (const stream of streams) {
                try {
                    const response = await axios.get('https://api.twitch.tv/helix/channels/followers', {
                        headers,
                        params: {
                            broadcaster_id: stream.user_id
                        }
                    });

                    followersCount[stream.user_id] = response.data.total || 0;
                    
                    // Petit délai pour éviter le rate limiting
                    await this.delay(50);
                    
                } catch (error) {
                    // Si erreur pour un streamer spécifique, on continue avec 0 followers
                    console.warn(`⚠️ Impossible de récupérer les followers pour ${stream.user_name}: ${error.response?.status}`);
                    followersCount[stream.user_id] = 0;
                }
            }

            console.log(`✅ Nombre de followers récupéré pour ${Object.keys(followersCount).length} streamers`);
            return followersCount;

        } catch (error) {
            console.error('❌ Erreur lors de la récupération des followers:', error.response?.data || error.message);
            throw new Error('Impossible de récupérer le nombre de followers');
        }
    }

    /**
     * Traite les streams: récupère tout, prend les 100 derniers, filtre, enrichit et sélectionne
     * 
     * Workflow:
     * 1. Récupération complète des streams français via pagination
     * 2. Sélection des 100 derniers (plus petites audiences)
     * 3. Filtrage par durée (>10 minutes)
     * 4. Enrichissement avec données utilisateur et followers
     * 5. Tri par nombre de followers croissant
     * 6. Limitation aux 50 premiers
     * 
     * @async
     * @returns {Promise<Array>} Les streamers sélectionnés triés par nombre de followers
     * @throws {Error} En cas d'erreur lors du traitement
     */
    async processStreams() {
        try {
            // 1. Récupérer tous les streams avec pagination complète
            const allStreams = await this.getAllStreams();
            
            if (allStreams.length === 0) {
                console.log('📭 Aucun stream récupéré');
                return [];
            }

            // 2. Prendre les 100 derniers streamers (fin de pagination = plus petites audiences)
            const last100Streams = allStreams.slice(-100);
            console.log(`🎯 Sélection des 100 derniers streams sur ${allStreams.length} total`);
            
            // 3. Filtrer ceux qui streament depuis plus de 10 minutes
            const filteredStreams = this.filterStreams(last100Streams);
            
            if (filteredStreams.length === 0) {
                console.log('📭 Aucun stream ne correspond aux critères après filtrage');
                return [];
            }

            // 4. Récupérer les infos utilisateurs pour les streams filtrés
            const usersInfo = await this.getUsersInfo(filteredStreams);
            
            // 5. Récupérer le nombre de followers pour les streams filtrés
            const followersCount = await this.getFollowersCount(filteredStreams);
            
            // 6. Enrichir les données des streams filtrés
            const enrichedStreams = filteredStreams.map(stream => ({
                id: stream.user_id,
                login: usersInfo[stream.user_id]?.login || stream.user_login,
                display_name: usersInfo[stream.user_id]?.display_name || stream.user_name,
                title: stream.title,
                game_name: stream.game_name,
                started_at: stream.started_at,
                viewer_count: stream.viewer_count,
                followers: followersCount[stream.user_id] || 0,
                profile_image_url: usersInfo[stream.user_id]?.profile_image_url || '',
                description: usersInfo[stream.user_id]?.description || '',
                created_at: usersInfo[stream.user_id]?.created_at || ''
            }));

            // 7. Trier par nombre de followers (croissant) et garder les 50 plus petits
            const sortedStreams = enrichedStreams
                .sort((a, b) => a.followers - b.followers);
                
            // Garder les 50 plus petits (ou moins si on en a moins)
            const finalStreams = sortedStreams.slice(0, Math.min(50, sortedStreams.length));

            console.log(`🎯 Workflow terminé: ${allStreams.length} total -> ${last100Streams.length} derniers -> ${filteredStreams.length} filtrés -> ${enrichedStreams.length} enrichis -> ${finalStreams.length} sélectionnés finalement`);
            return finalStreams;

        } catch (error) {
            console.error('❌ Erreur lors du traitement des streams:', error.message);
            throw error;
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
}

module.exports = TwitchStreamsService;