const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/database');
const Usuario = require('./modelos/Usuario');
const Equipo = require('./modelos/Equipo');
const Reserva = require('./modelos/Reserva');

const rutasAutenticacion = require('./rutas/autenticacion');
const rutasEquipos = require('./rutas/equipos');
const rutasReservas = require('./rutas/reservas');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', rutasAutenticacion);
app.use('/api/equipos', rutasEquipos);
app.use('/api/reservas', rutasReservas);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.status(200).json({ mensaje: 'Servidor funcionando correctamente' });
});

// Sincronizar modelos con la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
  })
  .catch(err => {
    console.error('Error al sincronizar base de datos:', err);
  });

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});

module.exports = app;
