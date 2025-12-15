const express = require('express');
const { body } = require('express-validator');
const { registrar, iniciarSesion } = require('../controladores/autenticacionCtrl');

const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/registro', [
  body('nombre').notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('El email debe ser válido'),
  body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], registrar);

// Ruta para iniciar sesión
router.post('/login', [
  body('email').isEmail().withMessage('El email debe ser válido'),
  body('contrasena').notEmpty().withMessage('La contraseña es requerida')
], iniciarSesion);

module.exports = router;
