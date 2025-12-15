const Equipo = require('../modelos/Equipo');
const Reserva = require('../modelos/Reserva');
const { Op } = require('sequelize');

// Obtener todos los equipos
const obtenerEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.findAll();
    res.status(200).json(equipos);
  } catch (error) {
    console.error('Error al obtener equipos:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipos' });
  }
};

// Obtener equipos disponibles para una fecha específica
const obtenerDisponibles = async (req, res) => {
  try {
    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({ mensaje: 'La fecha es requerida' });
    }

    // Convertir fecha a formato DATE
    const fechaInicio = new Date(fecha);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fecha);
    fechaFin.setHours(23, 59, 59, 999);

    // Obtener equipos que tienen reservas en esa fecha
    const equiposReservados = await Reserva.findAll({
      attributes: ['equipoId'],
      where: {
        fechaReserva: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        estado: 'activa'
      }
    });

    const idsReservados = equiposReservados.map(r => r.equipoId);

    // Obtener equipos disponibles (no reservados en esa fecha)
    const equiposDisponibles = await Equipo.findAll({
      where: {
        id: {
          [Op.notIn]: idsReservados.length > 0 ? idsReservados : [0]
        },
        estado: 'disponible'
      }
    });

    res.status(200).json(equiposDisponibles);
  } catch (error) {
    console.error('Error al obtener equipos disponibles:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipos disponibles' });
  }
};

// Obtener un equipo por ID
const obtenerEquipoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await Equipo.findByPk(id);

    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    res.status(200).json(equipo);
  } catch (error) {
    console.error('Error al obtener equipo:', error);
    res.status(500).json({ mensaje: 'Error al obtener equipo' });
  }
};

module.exports = { obtenerEquipos, obtenerDisponibles, obtenerEquipoPorId };
