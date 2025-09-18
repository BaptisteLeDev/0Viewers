const express = require('express');
const CacheService = require('../services/cacheService');

const router = express.Router();
const cacheService = new CacheService();

/**
 * GET /api/health
 * Endpoint de vérification de santé du serveur
 */
router.get('/health', (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cache: {
                valid: cacheService.isCacheValid(),
                lastRefresh: cacheService.getLastRefreshTime()
            }
        };
        
        res.json(health);
    } catch (error) {
        res.status(500).json({
            status: 'unhealthy',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /api/zero-streamers
 * Récupère la liste des streamers avec 0 viewers
 */
router.get('/zero-streamers', async (req, res) => {
    try {
        console.log('📡 Requête reçue pour /api/zero-streamers');
        
        // Paramètre optionnel pour forcer le rafraîchissement
        const forceRefresh = req.query.refresh === 'true';
        
        const streamers = await cacheService.getZeroStreamers(forceRefresh);
        
        res.json({
            success: true,
            count: streamers.length,
            data: streamers,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ ${streamers.length} streamers retournés`);
        
    } catch (error) {
        console.error('❌ Erreur dans /api/zero-streamers:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des streamers',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
        });
    }
});

/**
 * GET /api/cache/info
 * Récupère les informations sur le cache
 */
router.get('/cache/info', async (req, res) => {
    try {
        const cacheInfo = await cacheService.getCacheInfo();
        
        res.json({
            success: true,
            cache: cacheInfo
        });
        
    } catch (error) {
        console.error('❌ Erreur dans /api/cache/info:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des informations du cache'
        });
    }
});

/**
 * POST /api/cache/refresh
 * Force le rafraîchissement du cache
 */
router.post('/cache/refresh', async (req, res) => {
    try {
        console.log('🔄 Rafraîchissement forcé du cache demandé');
        
        const streamers = await cacheService.refreshCache();
        
        res.json({
            success: true,
            message: 'Cache rafraîchi avec succès',
            count: streamers.length,
            timestamp: new Date().toISOString()
        });
        
        console.log(`✅ Cache rafraîchi: ${streamers.length} streamers`);
        
    } catch (error) {
        console.error('❌ Erreur lors du rafraîchissement forcé:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'Erreur lors du rafraîchissement du cache',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: '0Viewers Backend'
    });
});

module.exports = { router, cacheService };