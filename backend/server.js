const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Importar la configuración de la base de datos
const database = require('./src/config/database');
// Importar rutas
const routes = require('./src/routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging simple para desarrollo
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/*
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Hola, mundo!');
});
*/

// Usar las rutas definidas
app.use('/api', routes);

// Ruta de salud para verificar que el servidor está funcionando|

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Speedy ERP API'
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Maneho de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

/** ruta para probar la conexión a la base de datos
app.get('/test-db', async (req, res) => {
  let connection;
  try {
    const pool = database.getPool();
    connection = await pool.getConnection();

    const result = await connection.execute(
      'SELECT COUNT(*) as TOTAL FROM C_BPARTNER WHERE AD_CLIENT_ID = :clientId',
      { clientId: process.env.AD_CLIENT_ID }
    );

    res.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error al probar la conexión a la base de datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al probar la conexión a la base de datos',
      error: error.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
});
*/
// Iniciar el servidor después de establecer la conexión a la base de datos
async function startServer() {
  try {
    //Conectar a la base de datos
    await database.initialize();
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejar la terminación del proceso para cerrar la conexión a la base de datos
process.on('SIGINT', async () => {
  console.log('Cerrando el servidor...');
  await database.close();
  process.exit(0);
});

startServer();