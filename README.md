# ShipNow API

## Descripción

API REST desarrollada con Node.js, Express y MongoDB,
implementada utilizando una arquitectura por capas.

## Arquitectura

La aplicación utiliza tres capas principales:

- Controller
- Service
- Repository

El flujo de dependencias es:

Controller → Service → Repository → MongoDB

### Controller

Gestiona las solicitudes HTTP y las respuestas.

### Service

Contiene las reglas y lógica de negocio.

### Repository

Centraliza el acceso a MongoDB mediante Mongoose.

## Configuración

Crear un archivo `.env` a partir de `.env.example`.

Variables requeridas:

PORT=3000
MONGODB_URI=
NODE_ENV=development

## Instalación

npm install

## Ejecución

npm start

## Arquitectura de carpetas

src/
├── config/
├── constants/
├── controllers/
├── services/
├── repositories/
├── models/
└── routes/

## Separación de responsabilidades

La separación permite evitar que los Controllers
conozcan detalles de persistencia.

El Repository encapsula las operaciones de MongoDB,
mientras que el Service contiene las reglas de negocio.

Esto facilita el mantenimiento, las pruebas y la
posibilidad de cambiar la implementación de persistencia
sin modificar los Controllers.