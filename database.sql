-- Script SQL para crear la base de datos y tablas
-- Ejecutar este script en MySQL Workbench

CREATE DATABASE IF NOT EXISTS reservas_equipos;
USE reservas_equipos;

-- Tabla de usuarios
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de equipos
CREATE TABLE equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado ENUM('disponible', 'no_disponible') DEFAULT 'disponible',
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de reservas
CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  equipoId INT NOT NULL,
  fechaReserva DATETIME NOT NULL,
  estado ENUM('activa', 'cancelada') DEFAULT 'activa',
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuarios(id),
  FOREIGN KEY (equipoId) REFERENCES equipos(id)
);

-- Insertar equipos de ejemplo
INSERT INTO equipos (nombre, descripcion, estado) VALUES
('Laptop Dell XPS 13', 'Laptop de alto rendimiento para desarrollo', 'disponible'),
('iMac 27 pulgadas', 'Computadora de escritorio para diseño gráfico', 'disponible'),
('Monitor LG 4K', 'Monitor de 4K para edición de video', 'disponible'),
('Teclado Mecánico RGB', 'Teclado mecánico para programación', 'disponible'),
('Mouse Logitech MX', 'Mouse inalámbrico de precisión', 'disponible');
