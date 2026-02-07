const oracledb = require('oracledb');
require('dotenv').config();

// Configuración de la conexión a la base de datos
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,
    poolMin: 2,
    poolMax: 10,
    poolIncrement: 1,
};

let pool;

async function initialize() {
    try {
        pool = await oracledb.createPool(dbConfig);
        console.log('Se ha establecido conexion a Oracle');
    } catch (err) {
        console.error('Error al establecer conexion a Oracle:', err);
        throw err;
    }
}

async function close() {
    try {
        await pool.close(10);
        console.log('Conexion a Oracle cerrada');
    } catch (err) {
        console.error('Error al cerrar conexion a Oracle:', err);
        throw err;
    }
}

function getPool() {
    return pool;
}

module.exports = {
    initialize,
    close,
    getPool,
}