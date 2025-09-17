
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connexion établie avec succès.');
    } catch (error) {
        console.error('Impossible de se connecter :', error);
    }
}

testConnection();