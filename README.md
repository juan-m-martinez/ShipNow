# ShipNow API

## Descripción

API REST desarrollada con Node.js, Express y MongoDB, implementada utilizando una arquitectura por capas.

## Tecnologías

- **Node.js:** → entorno de ejecución de JavaScript utilizado para ejecutar el backend.
- **JavaScript (CommonJS):** → lenguaje y sistema de módulos del proyecto (`require` y `module.exports`).
- **Express:** → framework para crear la API REST, definir rutas y procesar solicitudes JSON.
- **MongoDB Community Server:** → base de datos utilizada localmente para guardar la información.
- **Mongoose:** → ODM que conecta la aplicación con MongoDB y define los modelos de datos.
- **dotenv:** → carga variables de entorno desde el archivo `.env`.
- **npm:** → instala y administra las dependencias y los comandos del proyecto.
- **Git y GitHub:** → controlan las versiones del código y alojan el repositorio remoto.

## Arquitectura

La aplicación utiliza tres capas principales:

- **Controller:** gestiona las solicitudes HTTP y las respuestas.
- **Service:** contiene las reglas y la lógica de negocio.
- **Repository:** centraliza el acceso a MongoDB mediante Mongoose.

El flujo de dependencias es:

`Controller → Service → Repository → MongoDB`

## Configuración local

Asegurate de que el servicio de MongoDB esté en ejecución. Desde la raíz del proyecto, copiá la plantilla:

```powershell
Copy-Item .env.example .env
```

En `.env`, configurá:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/shipnow
NODE_ENV=development
```

`.env` contiene la configuración local y no debe subirse al repositorio.

## Instalación y ejecución

Desde la raíz del proyecto:

```powershell
npm install
npm start
```

## Endpoints disponibles

- `GET /api/products`: devuelve productos disponibles que tengan stock.
- `GET /api/users`: devuelve la lista de usuarios.

## Separación entre Service y Repository

El Controller recibe la solicitud HTTP y delega la operación al Service. El Service aplica reglas de negocio; por ejemplo, excluye productos sin stock. El Repository concentra las consultas a MongoDB y la selección de campos.

Esta separación permite cambiar cómo se guardan o consultan los datos sin mover las reglas de negocio, y modificar esas reglas sin hacer que el Controller conozca Mongoose.

## Estructura del proyecto

```text
ShipNow/
├── src/
│   ├── app.js                         → # Configura Express y monta las rutas de la API.
│   ├── server.js                      → # Conecta con MongoDB y pone el servidor en marcha.
│   ├── config/
│   │   ├── database.config.js         → # Establece y gestiona la conexión con MongoDB.
│   │   └── env.config.js              → # Carga y valida PORT, MONGODB_URI y NODE_ENV.
│   ├── constants/
│   │   └── index.js                   → # Define los estados de productos y roles de usuarios.
│   ├── controllers/
│   │   ├── product.controller.js      → # Atiende las solicitudes HTTP de productos.
│   │   └── user.controller.js         → # Atiende las solicitudes HTTP de usuarios.
│   ├── models/
│   │   ├── product.model.js           → # Define el esquema de productos en Mongoose.
│   │   └── user.model.js              → # Define el esquema de usuarios en Mongoose.
│   ├── repositories/
│   │   ├── product.repository.js      → # Consulta productos en MongoDB y selecciona sus campos.
│   │   └── user.repository.js         → # Consulta usuarios en MongoDB y selecciona sus campos.
│   ├── routes/
│   │   ├── product.routes.js          → # Asocia GET /api/products con su Controller.
│   │   └── user.routes.js             → # Asocia GET /api/users con su Controller.
│   └── services/
│       ├── product.service.js         → # Aplica reglas de negocio para productos.
│       └── user.service.js            → # Prepara los datos de usuarios para la respuesta.
├── .env.example                       → # Plantilla de variables de entorno sin datos privados.
├── .gitignore                         → # Excluye archivos locales como .env y node_modules.
├── package.json                       → # Declara dependencias y comandos del proyecto.
├── package-lock.json                  → # Registra las versiones instaladas de las dependencias.
└── README.md                          → # Documentación del proyecto.
```
