const Reserva = require('../modelos/Reserva');
const Usuario = require('../modelos/Usuario');
const Equipo = require('../modelos/Equipo');
const { Op } = require('sequelize');

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  try {
    const { equipoId, fechaReserva } = req.body;
    const usuarioId = req.usuarioId;

    if (!equipoId || !fechaReserva) {
      return res.status(400).json({ mensaje: 'equipoId y fechaReserva son requeridos' });
    }

    // Validación: Verificar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(fechaReserva);
    fechaSeleccionada.setHours(0, 0, 0, 0);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      return res.status(400).json({ mensaje: 'No se pueden realizar reservas en fechas pasadas. Por favor selecciona una fecha actual o futura.' });
    }

    // Verificar que el equipo existe
    const equipo = await Equipo.findByPk(equipoId);
    if (!equipo) {
      return res.status(404).json({ mensaje: 'Equipo no encontrado' });
    }

    // Convertir fecha a formato DATE
    const fechaInicio = new Date(fechaReserva);
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = new Date(fechaReserva);
    fechaFin.setHours(23, 59, 59, 999);

    // Validación 1: Verificar que el equipo no esté reservado en esa fecha
    const reservaEquipo = await Reserva.findOne({
      where: {
        equipoId,
        fechaReserva: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        estado: 'activa'
      }
    });

    if (reservaEquipo) {
      return res.status(400).json({ mensaje: 'Este equipo ya está reservado para esa fecha' });
    }

    // Validación 2: Verificar que el usuario no tenga otra reserva el mismo día
    const reservaUsuario = await Reserva.findOne({
      where: {
        usuarioId,
        fechaReserva: {
          [Op.between]: [fechaInicio, fechaFin]
        },
        estado: 'activa'
      }
    });

    if (reservaUsuario) {
      return res.status(400).json({ mensaje: 'Ya tienes una reserva para ese día' });
    }

    // Crear la reserva
    const nuevaReserva = await Reserva.create({
      usuarioId,
      equipoId,
      fechaReserva: new Date(fechaReserva)
    });

    // Obtener la reserva con los datos del usuario y equipo
    const reservaConDetalles = await Reserva.findByPk(nuevaReserva.id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email'] },
        { model: Equipo, attributes: ['id', 'nombre', 'descripcion'] }
      ]
    });

    res.status(201).json({
      mensaje: 'Reserva creada correctamente',
      reserva: reservaConDetalles
    });
  } catch (error) {
    console.error('Error al crear reserva:', error);
    res.status(500).json({ mensaje: 'Error al crear reserva' });
  }
};

// Obtener mis reservas (del usuario autenticado)
const obtenerMisReservas = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    const reservas = await Reserva.findAll({
      where: { usuarioId },
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email'] },
        { model: Equipo, attributes: ['id', 'nombre', 'descripcion'] }
      ],
      order: [['fechaReserva', 'DESC']]
    });

    res.status(200).json(reservas);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

// Cancelar una reserva
const cancelarReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuarioId;

    // Buscar la reserva
    const reserva = await Reserva.findByPk(id);
    if (!reserva) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }

    // Verificar que la reserva pertenece al usuario
    if (reserva.usuarioId !== usuarioId) {
      return res.status(403).json({ mensaje: 'No tienes permiso para cancelar esta reserva' });
    }

    // Actualizar estado a cancelada
    reserva.estado = 'cancelada';
    await reserva.save();

    res.status(200).json({
      mensaje: 'Reserva cancelada correctamente',
      reserva
    });
  } catch (error) {
    console.error('Error al cancelar reserva:', error);
    res.status(500).json({ mensaje: 'Error al cancelar reserva' });
  }
};

module.exports = { crearReserva, obtenerMisReservas, cancelarReserva };
