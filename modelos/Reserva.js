const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Equipo = require('./Equipo');

const Reserva = sequelize.define('Reserva', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id'
    }
  },
  equipoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Equipo,
      key: 'id'
    }
  },
  fechaReserva: {
    type: DataTypes.DATE,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('activa', 'cancelada'),
    defaultValue: 'activa'
  },
  fechaCreacion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'reservas',
  timestamps: false
});

// Relaciones
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId' });
Reserva.belongsTo(Equipo, { foreignKey: 'equipoId' });
Usuario.hasMany(Reserva, { foreignKey: 'usuarioId' });
Equipo.hasMany(Reserva, { foreignKey: 'equipoId' });

module.exports = Reserva;
