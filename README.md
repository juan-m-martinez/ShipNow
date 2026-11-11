# ShipNow API

## Pre-entrega Módulo 5 — Documentación de API con Swagger

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
- **Winston:** → registra eventos de la aplicación con distintos niveles de importancia.
- **winston-daily-rotate-file:** → separa los registros en archivos diarios y limita el período de conservación.
- **swagger-jsdoc:** → genera la especificación OpenAPI a partir de las anotaciones de las rutas.
- **swagger-ui-express:** → publica la documentación interactiva de la API.
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

## Documentación de la API

Con el servidor en ejecución, abrí [http://localhost:3000/api/docs](http://localhost:3000/api/docs) para consultar y probar la documentación interactiva de Swagger UI.

La documentación incluye las rutas de Users, Products, Mocks y Logger, además de los esquemas reutilizables de usuario, producto, pedido, entrega, ítem de pedido y respuestas. Orders y Deliveries aparecen como etiquetas porque `/api/mocks/data` genera esos registros relacionados; el proyecto todavía no tiene endpoints propios para consultar o modificar pedidos y entregas. El esquema `OrderItem` es documental y no forma parte del modelo actual de pedido.

En Swagger, desplegá una operación, presioná **Try it out**, completá los parámetros si corresponde y elegí **Execute**. Para probar la carga de datos, usá `POST /api/mocks/seed` con `qty` en la query; no requiere body.

El endpoint `GET /api/logger/test` permite validar los niveles de logging y no representa una operación de negocio.

## Endpoints disponibles

- `GET /api/products`: devuelve productos disponibles que tengan stock.
- `GET /api/users`: devuelve la lista de usuarios.

### Prueba del logger

`GET /api/logger/test` genera un evento en cada nivel (`debug`, `http`, `info`, `warning`, `error` y `fatal`) y devuelve una confirmación. Para probarlo, iniciá el servidor y abrí `http://localhost:3000/api/logger/test`.

## Logging

ShipNow usa Winston para registrar eventos. En desarrollo se muestran todos los niveles; en producción, el registro comienza en `info`.

Los archivos se generan en `logs/`:

- `app-AAAA-MM-DD.log`: registra los eventos según el nivel configurado para el entorno.
- `error-AAAA-MM-DD.log`: registra únicamente los niveles `error` y `fatal`.

Los archivos rotan diariamente y se conservan por 14 días. La carpeta `logs/` está excluida de Git.

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
│   │   ├── env.config.js               # Carga y valida PORT, MONGODB_URI y NODE_ENV.
│   │   ├── logger.config.js             # Configura niveles, consola y archivos rotativos de Winston.
│   │   └── swagger.config.js            # Define OpenAPI, esquemas y archivos de rutas a documentar.
│   ├── constants/
│   │   └── index.js                    # Define roles, estados y prioridades válidos.
│   ├── controllers/
│   │   ├── logger.controller.js        # Emite los niveles disponibles para probar el logger.
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
│   │   ├── logger.routes.js            # Conecta /api/logger/test con su Controller.
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
