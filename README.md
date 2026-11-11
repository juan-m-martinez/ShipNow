# ShipNow API

## Pre-entrega Módulo 3 — Manejo profesional de errores

## Descripción

API REST desarrollada con Node.js, Express y MongoDB, implementada utilizando una arquitectura por capas.

## Tecnologías

- **Node.js:** → entorno de ejecución de JavaScript utilizado para ejecutar el backend.
- **JavaScript (CommonJS):** → lenguaje y sistema de módulos del proyecto (`require` y `module.exports`).
- **Express:** → framework para crear la API REST, definir rutas y procesar solicitudes JSON.
- **MongoDB Community Server:** → base de datos utilizada localmente para guardar la información.
- **Mongoose:** → ODM que conecta la aplicación con MongoDB y define los modelos de datos.
- **dotenv:** → carga variables de entorno desde el archivo `.env`.
- **Faker:** → genera nombres y otros datos ficticios en español para probar la API.
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

### Endpoints de mocking

Los endpoints `GET` generan datos simulados en memoria y no los guardan en MongoDB:

- `GET /api/mocks/users?qty=2`: genera dos usuarios con rol `USER`.
- `GET /api/mocks/couriers?qty=2`: genera dos usuarios con rol `COURIER`.
- `GET /api/mocks/data?qty=2`: genera un conjunto relacionado con dos usuarios, dos repartidores, dos pedidos y dos entregas. Cada pedido referencia un usuario y cada entrega referencia un pedido; las entregas asignadas también referencian un repartidor.

El parámetro `qty` es obligatorio y debe ser un número entero entre 1 y 100. Para `data` y `seed`, indica cuántos registros generar de cada tipo.

Para guardar datos de prueba en MongoDB, usá:

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/mocks/seed?qty=2"
```

La respuesta informa cuántos usuarios, repartidores, pedidos y entregas se insertaron. Cada llamada a `seed` crea nuevos registros; no elimina los que ya existen.

## Manejo de errores

Los errores se centralizan mediante `AppError`, el diccionario de errores y el middleware global. La API responde con una estructura uniforme:

```json
{
  "status": "error",
  "error": {
    "code": "INVALID_MOCK_QTY",
    "message": "qty debe ser un número entero entre 1 y 100."
  }
}
```

El `code` identifica el error y `message` explica el problema. El estado HTTP corresponde al tipo de error; por ejemplo, las cantidades inválidas responden `400` y los errores al guardar mocks responden `500`.

Para probar errores de cantidad en mocks, iniciá la API y abrí:

- `GET http://localhost:3000/api/mocks/users?qty=-1`: valor negativo; debe responder `400` con `INVALID_MOCK_QTY`.
- `GET http://localhost:3000/api/mocks/users?qty=abc`: valor no numérico; debe responder `400` con `INVALID_MOCK_QTY`.
- `GET http://localhost:3000/api/mocks/users?qty=101`: supera el máximo permitido; debe responder `400` con `INVALID_MOCK_QTY`.
- `GET http://localhost:3000/api/ruta-inexistente`: ruta desconocida; debe responder `404` con `ROUTE_NOT_FOUND`.

Si falla la inserción de datos de prueba en MongoDB, `POST /api/mocks/seed?qty=2` responde con `MOCK_PERSISTENCE_FAILED` usando la misma estructura.

## Separación entre Service y Repository

El Controller recibe la solicitud HTTP y delega la operación al Service. El Service aplica reglas de negocio; por ejemplo, excluye productos sin stock. El Repository concentra las consultas a MongoDB y la selección de campos.

Esta separación permite cambiar cómo se guardan o consultan los datos sin mover las reglas de negocio, y modificar esas reglas sin hacer que el Controller conozca Mongoose.

## Estructura del proyecto

```text
ShipNow/
├── src/
│   ├── app.js                          # Configura Express y monta los routers.
│   ├── server.js                       # Conecta con MongoDB e inicia el servidor.
│   ├── config/
│   │   ├── database.config.js          # Gestiona la conexión con MongoDB.
│   │   └── env.config.js               # Carga y valida PORT, MONGODB_URI y NODE_ENV.
│   ├── constants/
│   │   └── index.js                    # Define roles, estados y prioridades válidos.
│   ├── controllers/
│   │   ├── mock.controller.js          # Atiende las solicitudes HTTP de mocking.
│   │   ├── product.controller.js       # Atiende las solicitudes HTTP de productos.
│   │   └── user.controller.js          # Atiende las solicitudes HTTP de usuarios.
│   ├── errors/
│   │   ├── app.error.js                # Crea errores personalizados a partir de códigos.
│   │   └── error.dictionary.js         # Mapea códigos de error a estados y mensajes.
│   ├── middlewares/
│   │   ├── error.middleware.js         # Devuelve las respuestas de error en formato común.
│   │   └── not-found.middleware.js     # Convierte rutas inexistentes en ROUTE_NOT_FOUND.
│   ├── models/
│   │   ├── delivery.model.js           # Define entregas y referencias a pedidos y repartidores.
│   │   ├── order.model.js              # Define pedidos y su referencia al usuario.
│   │   ├── product.model.js            # Define el esquema de productos.
│   │   └── user.model.js               # Define el esquema de usuarios y sus roles.
│   ├── repositories/
│   │   ├── mock.repository.js          # Inserta usuarios, pedidos y entregas simulados.
│   │   ├── product.repository.js       # Consulta productos y selecciona sus campos.
│   │   └── user.repository.js          # Consulta usuarios y selecciona sus campos.
│   ├── routes/
│   │   ├── mock.routes.js              # Conecta /api/mocks con su Controller.
│   │   ├── product.routes.js           # Conecta /api/products con su Controller.
│   │   └── user.routes.js              # Conecta /api/users con su Controller.
│   └── services/
│       ├── mock-data.factory.js        # Genera usuarios, repartidores, pedidos y entregas.
│       ├── mock.service.js             # Valida qty y coordina la generación y carga de mocks.
│       ├── product.service.js          # Aplica reglas de negocio para productos.
│       └── user.service.js             # Prepara los datos de usuarios para la respuesta.
├── .env.example                        # Plantilla de variables de entorno sin datos privados.
├── .gitignore                          # Excluye .env, node_modules y otros archivos locales.
├── package.json                        # Declara dependencias y comandos del proyecto.
├── package-lock.json                   # Registra las versiones instaladas de dependencias.
└── README.md                           # Documentación del proyecto.
```
