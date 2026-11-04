require('dotenv').config();

const knex = require('knex');

const db = knex({
    client: 'mssql',
    connection: {
        server: process.env.DB_SERVER,
        port: 1433,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        options: {
            encrypt: true,
            trustServerCertificate: true
        }
    },
    pool: {
        min: 0,
        max: 10
    }
});

module.exports = db;