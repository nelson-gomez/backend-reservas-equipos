const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuración de conexión a MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: false
  }
);

// Verificar conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a MySQL establecida correctamente');
  })
  .catch(err => {
    console.error('Error al conectar a MySQL:', err);
  });

module.exports = sequelize;
