# Backend - Sistema de Reservas de Equipos de Cómputo

## Descripción
Backend desarrollado con Node.js, Express y MySQL para gestionar reservas de equipos de cómputo. Incluye autenticación con JWT, validación de datos y lógica de negocio para evitar conflictos de reservas.

## Requisitos Previos
- Node.js (v14 o superior)
- MySQL Server
- MySQL Workbench (opcional, para gestionar la BD)

## Instalación

### 1. Clonar o descargar el proyecto
```bash
cd backend-reservas-equipos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar la base de datos en MySQL

Abre MySQL Workbench y ejecuta el siguiente script SQL:

```sql
CREATE DATABASE IF NOT EXISTS reservas_equipos;
USE reservas_equipos;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  contrasena VARCHAR(255) NOT NULL,
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE equipos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  estado ENUM('disponible', 'no_disponible') DEFAULT 'disponible',
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

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
```

### 4. Configurar variables de entorno

Edita el archivo `.env` con tus credenciales de MySQL:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=reservas_equipos
DB_PORT=3306
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
PORT=5000
NODE_ENV=development
```

### 5. Iniciar el servidor

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## Endpoints Disponibles

### Autenticación
- **POST** `/api/auth/registro` - Registrar nuevo usuario
- **POST** `/api/auth/login` - Iniciar sesión

### Equipos
- **GET** `/api/equipos` - Obtener todos los equipos
- **GET** `/api/equipos/disponibles?fecha=YYYY-MM-DD` - Obtener equipos disponibles para una fecha
- **GET** `/api/equipos/:id` - Obtener un equipo por ID

### Reservas (requieren autenticación)
- **POST** `/api/reservas` - Crear una nueva reserva
- **GET** `/api/reservas/mis-reservas` - Obtener mis reservas
- **DELETE** `/api/reservas/:id` - Cancelar una reserva

## Estructura del Proyecto

```
backend-reservas-equipos/
├── config/
│   └── database.js          # Configuración de conexión a MySQL
├── modelos/
│   ├── Usuario.js           # Modelo de usuario
│   ├── Equipo.js            # Modelo de equipo
│   └── Reserva.js           # Modelo de reserva
├── controladores/
│   ├── autenticacionCtrl.js # Lógica de autenticación
│   ├── equiposCtrl.js       # Lógica de equipos
│   └── reservasCtrl.js      # Lógica de reservas
├── rutas/
│   ├── autenticacion.js     # Rutas de autenticación
│   ├── equipos.js           # Rutas de equipos
│   └── reservas.js          # Rutas de reservas
├── middleware/
│   └── autenticacion.js     # Middleware de verificación JWT
├── app.js                   # Punto de entrada principal
├── package.json             # Dependencias del proyecto
├── .env                     # Variables de entorno
└── README.md                # Este archivo
```

## Validaciones Implementadas

✅ Email único por usuario  
✅ Contraseña encriptada con bcrypt  
✅ Un equipo no puede estar reservado dos veces el mismo día  
✅ Un usuario no puede reservar más de un equipo el mismo día  
✅ Rutas protegidas con JWT  
✅ Validación de datos con express-validator  

## Notas Importantes

- Los tokens JWT expiran en 24 horas
- Las contraseñas deben tener mínimo 6 caracteres
- El email debe ser único en el sistema
- Las fechas de reserva deben estar en formato ISO 8601 (YYYY-MM-DD)
