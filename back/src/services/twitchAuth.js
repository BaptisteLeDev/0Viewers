const axios = require('axios');

class TwitchAuthService {
    constructor() {
        this.clientId = process.env.TWITCH_CLIENT_ID;
        this.clientSecret = process.env.TWITCH_CLIENT_SECRET;
        this.accessToken = process.env.TWITCH_ACCESS_TOKEN;
        this.tokenExpiresAt = null;
    }

    /**
     * Vérifie si le token actuel est valide
     * @returns {boolean} true si le token est valide, false sinon
     */
    isTokenValid() {
        if (!this.accessToken || !this.tokenExpiresAt) {
            return false;
        }
        
        // Ajoute une marge de 5 minutes avant expiration
        const now = new Date();
        const expirationWithMargin = new Date(this.tokenExpiresAt.getTime() - 5 * 60 * 1000);
        
        return now < expirationWithMargin;
    }

    /**
     * Génère un nouveau token Twitch via OAuth2 client credentials
     * @returns {Promise<string>} Le token d'accès généré
     */
    async generateToken() {
        try {
            console.log('🔄 Génération d\'un nouveau token Twitch...');
            
            const response = await axios.post('https://id.twitch.tv/oauth2/token', null, {
                params: {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    grant_type: 'client_credentials'
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token, expires_in } = response.data;
            
            this.accessToken = access_token;
            this.tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
            
            console.log('✅ Token Twitch généré avec succès');
            console.log(`📅 Expire le: ${this.tokenExpiresAt.toISOString()}`);
            
            return access_token;
        } catch (error) {
            console.error('❌ Erreur lors de la génération du token Twitch:', error.response?.data || error.message);
            throw new Error('Impossible de générer le token Twitch');
        }
    }

    /**
     * Récupère un token valide (génère un nouveau si nécessaire)
     * @returns {Promise<string>} Token d'accès valide
     */
    async getValidToken() {
        if (!this.isTokenValid()) {
            await this.generateToken();
        }
        return this.accessToken;
    }

    /**
     * Valide un token auprès de l'API Twitch
     * @returns {Promise<boolean>} true si le token est valide
     */
    async validateToken() {
        if (!this.accessToken) {
            return false;
        }

        try {
            const response = await axios.get('https://id.twitch.tv/oauth2/validate', {
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            return response.status === 200;
        } catch (error) {
            console.log('🔄 Token invalide, régénération nécessaire');
            return false;
        }
    }

    /**
     * Récupère les headers d'autorisation pour les requêtes API Twitch
     * @returns {Promise<Object>} Headers avec authorization et client-id
     */
    async getAuthHeaders() {
        const token = await this.getValidToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Client-Id': this.clientId
        };
    }
}

module.exports = TwitchAuthService;