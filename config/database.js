
require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'SistemaGestionVentas',
    process.env.DB_USER || '',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost\\SQLEXPRESS',
        dialect: 'mssql',
        dialectModule: require('tedious'),
        dialectOptions: {
            options: {
                trustedConnection: true,
                encrypt: true,
                trustServerCertificate: true
            }
        },
        logging: false
    }
);

async function conectarSequelize() {
    try {
        await sequelize.authenticate();
        console.log('Sequelize conectado correctamente a SQL Server Express');
    } catch (error) {
        console.error('Error de conexión Sequelize:', error.message);
        throw error;
    }
}

module.exports = { sequelize, conectarSequelize };
