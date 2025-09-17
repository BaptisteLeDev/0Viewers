import { Sequelize } from 'sequelize';

// Paramètres de connexion
const host = 'db.rxtcwunuzksnqrjonreb.supabase.co';
const port = '5432';
const dbName = 'postgres';
const user = 'postgres';
const password = encodeURIComponent('c5#+Dr*yHJX=M.');

const url = `postgres://${user}:${password}@${host}:${port}/${dbName}`;


const sequelize = new Sequelize(url, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false }
    },
    logging: false,
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connexion réussie à Supabase !');
    } catch (error) {
        console.error('Impossible de se connecter :', error);
    } finally {
        await sequelize.close();
    }
})();

