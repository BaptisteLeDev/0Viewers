#!/usr/bin/env node

/**
 * Script de vérification de santé du serveur 0Viewers
 * Vérifie que l'API backend fonctionne correctement
 */

require('dotenv').config();
const axios = require('axios');

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001';
const TIMEOUT = parseInt(process.env.HEALTH_CHECK_TIMEOUT) || 5000;

/**
 * Vérifie la santé du serveur
 */
async function healthCheck() {
    console.log('🔍 Vérification de la santé du serveur 0Viewers...\n');

    try {
        // Test de l'endpoint principal
        console.log('1. Test de la racine de l\'API...');
        const healthResponse = await axios.get(`${SERVER_URL}/api/health`, {
            timeout: TIMEOUT
        });
        console.log('✅ Endpoint /api/health accessible');

        // Test de l'endpoint principal des streamers
        console.log('\n2. Test de l\'endpoint streamers...');
        const streamersResponse = await axios.get(`${SERVER_URL}/api/zero-streamers`, {
            timeout: TIMEOUT
        });
        
        const data = streamersResponse.data;
        console.log('✅ Endpoint /api/zero-streamers accessible');
        console.log(`📊 ${data.count || 0} streamers disponibles`);
        console.log(`⏰ Dernière mise à jour: ${new Date(data.timestamp).toLocaleString('fr-FR')}`);

        // Vérification de la fraîcheur des données
        const lastUpdate = new Date(data.timestamp);
        const now = new Date();
        const ageMinutes = Math.floor((now - lastUpdate) / (1000 * 60));
        
        if (ageMinutes > 15) {
            console.log(`⚠️ Les données sont un peu anciennes (${ageMinutes} minutes)`);
        } else {
            console.log(`✅ Données récentes (${ageMinutes} minutes)`);
        }

        console.log('\n🎉 Serveur en bonne santé !');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erreur lors de la vérification de santé:');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('🔌 Serveur inaccessible - Vérifiez qu\'il est démarré');
        } else if (error.code === 'ENOTFOUND') {
            console.error('🌐 URL invalide ou problème de réseau');
        } else if (error.response) {
            console.error(`📡 Erreur HTTP ${error.response.status}: ${error.response.statusText}`);
        } else {
            console.error(`🚨 ${error.message}`);
        }
        
        console.error(`\n🔧 URL testée: ${SERVER_URL}`);
        console.error('💡 Assurez-vous que le serveur est démarré avec: npm start');
        
        process.exit(1);
    }
}

// Exécuter le health check
healthCheck();