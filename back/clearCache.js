const fs = require('fs');
const path = require('path');

const cacheFile = path.join(__dirname, 'cache', 'zero-streamers.json');

console.log('🗑️ Suppression du cache existant...');

try {
    if (fs.existsSync(cacheFile)) {
        fs.unlinkSync(cacheFile);
        console.log('✅ Cache supprimé avec succès');
    } else {
        console.log('ℹ️ Aucun cache à supprimer');
    }
} catch (error) {
    console.error('❌ Erreur lors de la suppression:', error.message);
}

console.log('🔄 Le cache sera recréé au prochain démarrage du serveur');