const express = require('express');
const path = require('path');
const CacheService = require('../services/cacheService');

const router = express.Router();
const cacheService = new CacheService();

/**
 * GET /dashboard
 * Page dashboard principale
 */
router.get('/', (req, res) => {
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

        const dashboardHTML = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>0Viewers Backend Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }
        
        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h3 {
            color: #4a5568;
            margin-bottom: 15px;
            font-size: 1.3rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-healthy {
            background-color: #48bb78;
        }
        
        .status-warning {
            background-color: #ed8936;
        }
        
        .status-error {
            background-color: #f56565;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .metric:last-child {
            border-bottom: none;
        }
        
        .metric-label {
            font-weight: 500;
            color: #64748b;
        }
        
        .metric-value {
            font-weight: bold;
            color: #1e293b;
        }
        
        .endpoints-list {
            list-style: none;
        }
        
        .endpoints-list li {
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .endpoints-list li:last-child {
            border-bottom: none;
        }
        
        .endpoint-method {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8rem;
            font-weight: bold;
            margin-right: 10px;
        }
        
        .method-get {
            background-color: #10b981;
            color: white;
        }
        
        .method-post {
            background-color: #3b82f6;
            color: white;
        }
        
        .footer {
            text-align: center;
            color: white;
            opacity: 0.8;
            margin-top: 30px;
        }
        
        .refresh-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            display: block;
            margin: 20px auto;
        }
        
        .refresh-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 0Viewers Backend</h1>
            <p>Dashboard de monitoring en temps réel</p>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <h3>
                    <span class="status-indicator ${health.status === 'healthy' ? 'status-healthy' : 'status-error'}"></span>
                    État du serveur
                </h3>
                <div class="metric">
                    <span class="metric-label">Status</span>
                    <span class="metric-value">${health.status.toUpperCase()}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Uptime</span>
                    <span class="metric-value">${Math.floor(health.uptime / 3600)}h ${Math.floor((health.uptime % 3600) / 60)}m</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Dernière vérification</span>
                    <span class="metric-value">${new Date(health.timestamp).toLocaleString('fr-FR')}</span>
                </div>
            </div>
            
            <div class="card">
                <h3>Mémoire</h3>
                <div class="metric">
                    <span class="metric-label">RSS</span>
                    <span class="metric-value">${Math.round(health.memory.rss / 1024 / 1024)} MB</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Heap Used</span>
                    <span class="metric-value">${Math.round(health.memory.heapUsed / 1024 / 1024)} MB</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Heap Total</span>
                    <span class="metric-value">${Math.round(health.memory.heapTotal / 1024 / 1024)} MB</span>
                </div>
            </div>
            
            <div class="card">
                <h3>
                    <span class="status-indicator ${health.cache.valid ? 'status-healthy' : 'status-warning'}"></span>
                    Cache
                </h3>
                <div class="metric">
                    <span class="metric-label">État</span>
                    <span class="metric-value">${health.cache.valid ? 'Valide' : 'Expiré'}</span>
                </div>
                <div class="metric">
                    <span class="metric-label">Dernière actualisation</span>
                    <span class="metric-value">${health.cache.lastRefresh ? new Date(health.cache.lastRefresh).toLocaleString('fr-FR') : 'Jamais'}</span>
                </div>
            </div>
            
            <div class="card">
                <h3>API Endpoints</h3>
                <ul class="endpoints-list">
                    <li>
                        <span class="endpoint-method method-get">GET</span>
                        <strong>/</strong> - Page d'accueil API
                    </li>
                    <li>
                        <span class="endpoint-method method-get">GET</span>
                        <strong>/api/health</strong> - Vérification santé
                    </li>
                    <li>
                        <span class="endpoint-method method-get">GET</span>
                        <strong>/api/streamers/zero-viewers</strong> - Liste streamers
                    </li>
                    <li>
                        <span class="endpoint-method method-post">POST</span>
                        <strong>/api/streamers/refresh</strong> - Actualiser cache
                    </li>
                    <li>
                        <span class="endpoint-method method-get">GET</span>
                        <strong>/dashboard</strong> - Dashboard actuel
                    </li>
                </ul>
            </div>
        </div>
        
        <button class="refresh-button" onclick="window.location.reload()">
            🔄 Actualiser le dashboard
        </button>
        
        <div class="footer">
            <p>Dashboard 0Viewers Backend - Version 1.0.0</p>
            <p>Développé avec ❤️ par BaptisteLeDev</p>
        </div>
    </div>
</body>
</html>
        `;

        res.send(dashboardHTML);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la génération du dashboard',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

/**
 * GET /dashboard/api
 * API pour récupérer les données du dashboard en JSON
 */
router.get('/api', (req, res) => {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cache: {
                valid: cacheService.isCacheValid(),
                lastRefresh: cacheService.getLastRefreshTime()
            },
            endpoints: [
                { method: 'GET', path: '/', description: 'Page d\'accueil API' },
                { method: 'GET', path: '/api/health', description: 'Vérification santé' },
                { method: 'GET', path: '/api/streamers/zero-viewers', description: 'Liste streamers' },
                { method: 'POST', path: '/api/streamers/refresh', description: 'Actualiser cache' },
                { method: 'GET', path: '/dashboard', description: 'Dashboard web' },
                { method: 'GET', path: '/dashboard/api', description: 'API Dashboard' }
            ]
        };
        
        res.json(health);
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Erreur lors de la récupération des données du dashboard',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

module.exports = router;