const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString:
        'Driver={ODBC Driver 18 for SQL Server};' +
        'Server=localhost\\SQLEXPRESS;' +
        'Database=SistemaGestionVentas;' +
        'Trusted_Connection=yes;' +
        'Encrypt=yes;' +
        'TrustServerCertificate=yes;'
};

async function conectarDB() {
    try {
        const pool = await sql.connect(config);
        console.log('Conexión con SQL Server exitosa.');
        return pool;
    } catch (error) {
        console.error('Error al conectar con SQL Server:', error.message);
        throw error;
    }
}

module.exports = { sql, conectarDB };
