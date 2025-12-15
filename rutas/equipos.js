const express = require('express');
const { obtenerEquipos, obtenerDisponibles, obtenerEquipoPorId } = require('../controladores/equiposCtrl');

const router = express.Router();

// Obtener todos los equipos
router.get('/', obtenerEquipos);

// Obtener equipos disponibles para una fecha específica
router.get('/disponibles', obtenerDisponibles);

// Obtener un equipo por ID
router.get('/:id', obtenerEquipoPorId);

module.exports = router;
