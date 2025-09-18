const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const { router: apiRoutes } = require('./src/routes/api');
const dashboardRoutes = require('./src/routes/dashboard');

// Import des services
const CacheService = require('./src/services/cacheService');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialiser le service de cache
const cacheService = new CacheService();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api', apiRoutes);
app.use('/dashboard', dashboardRoutes);

// Route de base
app.get('/', (req, res) => {
    res.json({
        message: '🎮 0Viewers API - Découvrez les streamers français oubliés',
        version: '1.0.0',
        endpoints: {
            health: '/api/health',
            streamers: '/api/streamers/zero-viewers',
            refresh: '/api/streamers/refresh',
            dashboard: '/dashboard'
        },
        dashboard: {
            web: '/dashboard',
            api: '/dashboard/api'
        },
        timestamp: new Date().toISOString()
    });
});

// Middleware de gestion d'erreur 404
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route non trouvée',
        message: `La route ${req.method} ${req.originalUrl} n'existe pas`,
        timestamp: new Date().toISOString()
    });
});

// Middleware de gestion d'erreur globale
app.use((error, req, res, next) => {
    console.error('❌ Erreur serveur:', error);
    
    res.status(error.status || 500).json({
        error: 'Erreur interne du serveur',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Une erreur est survenue',
        timestamp: new Date().toISOString()
    });
});

// Fonction de démarrage du serveur
async function startServer() {
    try {
        // Initialiser le service de cache
        console.log('🔄 Initialisation du service de cache...');
        await cacheService.initialize();
        
        // Démarrer le serveur seulement en mode développement local
        if (process.env.NODE_ENV !== 'production') {
            app.listen(PORT, () => {
                console.log(`🚀 Serveur 0Viewers démarré sur le port ${PORT}`);
                console.log(`📱 Frontend autorisé: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
                console.log(`🔗 API disponible sur: http://localhost:${PORT}`);
                console.log(`❤️  Prêt à découvrir des streamers français !`);
            });
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
    }
}

// Initialiser le cache au démarrage
startServer();

// Gestion propre de l'arrêt du serveur (seulement en développement)
if (process.env.NODE_ENV !== 'production') {
    process.on('SIGTERM', () => {
        console.log('📴 Arrêt du serveur...');
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('📴 Arrêt du serveur...');
        process.exit(0);
    });

    // Gestion des erreurs non capturées
    process.on('uncaughtException', (error) => {
        console.error('❌ Erreur non capturée:', error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('❌ Promise rejetée non gérée à:', promise, 'raison:', reason);
        process.exit(1);
    });
}

// Export pour Vercel
module.exports = app;