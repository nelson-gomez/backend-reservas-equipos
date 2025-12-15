const express = require('express');
const { body } = require('express-validator');
const { verificarToken } = require('../middleware/autenticacion');
const { crearReserva, obtenerMisReservas, cancelarReserva } = require('../controladores/reservasCtrl');

const router = express.Router();

// Crear una nueva reserva (requiere autenticación)
router.post('/', verificarToken, [
  body('equipoId').isInt().withMessage('equipoId debe ser un número entero'),
  body('fechaReserva').isISO8601().withMessage('fechaReserva debe ser una fecha válida')
], crearReserva);

// Obtener mis reservas (requiere autenticación)
router.get('/mis-reservas', verificarToken, obtenerMisReservas);

// Cancelar una reserva (requiere autenticación)
router.delete('/:id', verificarToken, cancelarReserva);

module.exports = router;
