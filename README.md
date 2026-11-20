# ShipNow API

## Pre-entrega Módulo 8 — Performance, escalabilidad y Docker

## Descripción

API REST desarrollada con Node.js, Express y MongoDB, implementada utilizando una arquitectura por capas. Incluye documentación Swagger, pruebas funcionales y carga de documentos y comprobantes asociados a usuarios y entregas.

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
- **Multer:** → valida y almacena archivos recibidos mediante `multipart/form-data`.
- **Mocha, Chai y Supertest:** → ejecutan pruebas funcionales HTTP y validan sus respuestas.
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
LOG_LEVEL=debug
UPLOADS_DIR=./uploads
```

`.env` contiene la configuración local y no debe subirse al repositorio.

## Instalación y ejecución

Desde la raíz del proyecto:

```powershell
npm.cmd install
npm.cmd start
```

## Documentación de la API

Con el servidor en ejecución, abrí [http://localhost:3000/api/docs](http://localhost:3000/api/docs) para consultar y probar la documentación interactiva de Swagger UI.

La documentación incluye las rutas de Users, Orders, Products, Mocks, Deliveries y Logger, además de los esquemas reutilizables de usuario, pedido, entrega, archivos y respuestas. Orders y Deliveries permiten crear, listar, consultar, actualizar y eliminar registros. Orders y Deliveries también permiten asociar comprobantes. El esquema `OrderItem` es documental y no forma parte del modelo actual de pedido.

En Swagger, desplegá una operación, presioná **Try it out**, completá los parámetros si corresponde y elegí **Execute**. Para probar la carga de datos, usá `POST /api/mocks/seed` con `qty` en la query; no requiere body.

El endpoint `GET /api/logger/test` permite validar los niveles de logging y no representa una operación de negocio.

## Endpoints disponibles

- `GET /api/products`: devuelve productos disponibles que tengan stock.
- `GET /api/health`: informa el estado, entorno, uptime y timestamp.
- `GET /api/users`: devuelve una página de usuarios (`page`, `limit`).
- `GET /api/orders`: devuelve una página de pedidos (`page`, `limit`).
- `POST /api/orders`: crea un pedido para un usuario existente. El body requiere `user` y `destination`; `priority` es opcional.
- `GET /api/orders/:orderId`: devuelve un pedido por su ID.
- `PUT /api/orders/:orderId`: actualiza los campos válidos de un pedido.
- `PATCH /api/orders/:orderId/status`: actualiza el estado con un valor permitido (`PENDING`, `ASSIGNED`, `IN_TRANSIT`, `DELIVERED` o `CANCELLED`).
- `DELETE /api/orders/:orderId`: elimina un pedido.
- `POST /api/orders/:orderId/proof`: recibe el archivo `proof` como `multipart/form-data` y lo asocia al pedido existente.
- `GET /api/deliveries`: devuelve una página de entregas (`page`, `limit`).
- `POST /api/deliveries`: crea una entrega para un pedido existente, con repartidor opcional.
- `GET /api/deliveries/:deliveryId`: devuelve una entrega por su ID.
- `PATCH /api/deliveries/:deliveryId`: actualiza el estado o el repartidor.
- `DELETE /api/deliveries/:deliveryId`: elimina una entrega.
- `POST /api/users/:userId/documents`: recibe `document` y `documentType` como `multipart/form-data` y asocia el documento al usuario.
- `POST /api/deliveries/:deliveryId/proof`: recibe el archivo `proof` como `multipart/form-data` y lo asocia a una entrega existente.

Los documentos de usuario aceptan `IDENTITY`, `DRIVER_LICENSE` o `ADDRESS_PROOF`. Los comprobantes reciben el tipo `ORDER_RECEIPT` para pedidos y `DELIVERY_RECEIPT` para entregas, asignado por el backend; no se envía un campo `proofType`. Los archivos permitidos son PDF, JPG/JPEG y PNG, con un tamaño máximo de 5 MB. Se guardan en `uploads/users/documents/`, `uploads/orders/receipts/` o `uploads/deliveries/receipts/`; MongoDB conserva únicamente los metadatos. `uploads/` está excluida de Git.

### Pruebas funcionales

Las pruebas usan **Mocha**, **Chai** y **Supertest**. Para preparar una instalación limpia con todas las dependencias de desarrollo:

```powershell
npm.cmd ci
```

Este comando instala también las dependencias de desarrollo, incluido Mocha en `node_modules/.bin`; `npm.cmd test` ejecuta esa instalación local.

En Windows, iniciá el servicio **MongoDB Server** desde la aplicación **Servicios** antes de la suite. Si MongoDB se instaló con el nombre de servicio `MongoDB`, también podés comprobarlo e iniciarlo desde PowerShell:

```powershell
Get-Service MongoDB
Start-Service MongoDB
```

Después ejecutá la suite desde la raíz:

```powershell
npm.cmd test
```

La suite cubre usuarios, pedidos, mocks, logger, Swagger UI y cargas de archivos válidas e inválidas, incluida la entidad inexistente. Antes de ejecutarla, asegurate de que MongoDB esté iniciado. `tests/setup.js` usa `MONGODB_URI=mongodb://127.0.0.1:27017/shipnow_test` y `.test-uploads/` para aislar los datos y archivos de prueba; ambas ubicaciones se limpian al terminar. No configures la URI de pruebas con la base de desarrollo.

`tests/errors.test.js` verifica explícitamente `ROUTE_NOT_FOUND`, `USER_NOT_FOUND`, `INVALID_DATA`, `INTERNAL_SERVER_ERROR`, `MOCK_GENERATION_FAILED` y `MOCK_PERSISTENCE_FAILED`. Los errores de estado, archivo y entidad se validan en sus pruebas funcionales de pedidos, entregas y cargas.

Los hooks limpian la base antes de cada caso y al terminar la suite, cierran la conexión y eliminan `.test-uploads/`. Ejecutá `npm.cmd test` dos veces seguidas, sin limpieza manual, para comprobar que ambas corridas son repetibles.

La prueba de humo también se puede ejecutar sola y levanta una instancia temporal para verificar Swagger y las operaciones OpenAPI de Users, Orders, Deliveries, Mocks y Logger:

```powershell
npm.cmd run test:smoke
```

### Prueba del logger

`GET /api/logger/test` genera un evento en cada nivel (`debug`, `http`, `info`, `warning`, `error` y `fatal`) y devuelve una confirmación. Para probarlo, iniciá el servidor y abrí `http://localhost:3000/api/logger/test`.

## Performance, producción y Docker

### Listados y archivos

`GET /api/users`, `GET /api/orders` y `GET /api/deliveries` aceptan `page` y `limit`. Por defecto devuelven 20 registros; `limit` admite de 1 a 100. La respuesta conserva la lista (`users`, `orders` o `deliveries`) y agrega `pagination` con `page`, `limit`, `total` y `totalPages`. Si los parámetros no son enteros válidos o `limit` supera 100, la API responde `400 INVALID_PAGINATION`. Las consultas seleccionan los campos necesarios cuando corresponde y usan `skip`/`limit` en MongoDB.

Multer acepta PDF, JPG/JPEG y PNG, limita cada archivo a 5 MB y almacena los archivos en `uploads/` (o en `UPLOADS_DIR`). MongoDB guarda metadatos, no el contenido binario. `uploads/` está excluida de Git y de la imagen. En despliegues que necesiten conservar archivos tras recrear el contenedor, montá un volumen persistente en el directorio configurado; definí además una política operativa de retención y borrado.

### Variables y ejecución local

`.env.example` enumera la configuración. `PORT`, `MONGODB_URI` y `NODE_ENV` son obligatorias; la aplicación falla al iniciar con el nombre de las variables faltantes o inválidas. `NODE_ENV` admite `development`, `test` o `production`. `LOG_LEVEL` es opcional y acepta `fatal`, `error`, `warning`, `info`, `http` o `debug`; por defecto es `debug` en desarrollo y `info` en otros entornos. `UPLOADS_DIR` es opcional.

En testing, la suite selecciona la base aislada `shipnow_test`. Para producción, definí `NODE_ENV=production`, `LOG_LEVEL=info` y la URI de MongoDB del entorno de despliegue.

La aplicación no integra autenticación JWT ni servicios externos actualmente, por lo que no necesita `JWT_SECRET` ni URLs externas. Si se incorporan esas integraciones, deben configurarse como variables de entorno antes de activarlas; no se deben escribir secretos en el código.

Para desarrollo local, creá `.env` desde la plantilla, configurá MongoDB local, instalá y ejecutá:

```powershell
Copy-Item .env.example .env
npm.cmd ci
npm.cmd start
```

Para ejecutar las pruebas funcionales, iniciá primero MongoDB y usá:

```powershell
npm.cmd test
npm.cmd run test:smoke
```

La suite usa `shipnow_test`; no apunta a la base de desarrollo. Swagger permanece en `/api/docs` y el health check está en `/api/health`. El health check informa únicamente estado, entorno, uptime y timestamp.

### Política de endpoints internos

En `NODE_ENV=production`, `GET /api/mocks/*` y `GET /api/logger/test` no se montan y responden como rutas inexistentes (`404`). Sus operaciones también se retiran de la especificación publicada. Swagger UI y OpenAPI permanecen disponibles en `/api/docs` para consultar la API pública; no requieren autenticación. En `development` y `test`, mocks y logger test están habilitados para pruebas y desarrollo.

### Construcción y ejecución con Docker

Requisitos: Docker instalado y una instancia MongoDB accesible desde el contenedor. Construí la imagen desde la carpeta `ShipNow`:

```powershell
docker build -t shipnow:latest .
```

Creá un archivo local `.env.docker` con las variables de ejecución (no se copia a la imagen ni se sube a Git). Usá `NODE_ENV=production`, `PORT=3000`, `LOG_LEVEL=info` y una `MONGODB_URI` alcanzable desde el contenedor. Pasá ese archivo y publicá el puerto:

```powershell
docker run --name shipnow-api --env-file .env.docker -p 3000:3000 -v shipnow-uploads:/app/uploads shipnow:latest
```

Dentro de Docker, `127.0.0.1` apunta al mismo contenedor. Si MongoDB corre en la computadora anfitriona con Docker Desktop, configurá `MONGODB_URI=mongodb://host.docker.internal:27017/shipnow` en el archivo de entorno usado por el contenedor. Si MongoDB está en otro contenedor o servicio, usá su nombre de host y puerto en la misma red. Para cambiar el puerto interno, actualizá `PORT` y el mapeo `-p PUERTO_HOST:PUERTO_CONTENEDOR`.

Con el contenedor en ejecución, comprobá:

- `http://localhost:3000/api/health`
- `http://localhost:3000/api/docs`
- `http://localhost:3000/api/products`

La imagen incluye solo dependencias de producción, corre como usuario sin privilegios y tiene un health check de Docker que consulta `/api/health`. `.dockerignore` evita copiar `node_modules`, `.env`, `.git`, logs, uploads, coverage y temporales. No subas al repositorio `.env`, `node_modules/`, `logs/`, `uploads/`, `.test-uploads/` ni `coverage/`; Git y Docker los excluyen.

Winston escribe a consola y a `logs/`; los archivos de log rotan cada día y se conservan 14 días. En contenedores, consultá los registros de consola con `docker logs shipnow-api`; los archivos internos son efímeros salvo que se monte un volumen para `logs/`.

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
│   │   ├── env.config.js               # Carga y valida PORT, MONGODB_URI, NODE_ENV y LOG_LEVEL.
│   │   ├── logger.config.js            # Configura niveles, consola y archivos rotativos de Winston.
│   │   ├── upload.config.js            # Configura tipos, tamaño, nombres y carpetas de Multer.
│   │   └── swagger.config.js           # Define OpenAPI, esquemas y archivos de rutas a documentar.
│   ├── constants/
│   │   └── index.js                    # Define roles, estados, prioridades y tipos de documento.
│   ├── controllers/
│   │   ├── logger.controller.js        # Emite los niveles disponibles para probar el logger.
│   │   ├── mock.controller.js          # Atiende las solicitudes HTTP de mocking.
│   │   ├── order.controller.js         # Atiende pedidos y carga sus comprobantes.
│   │   ├── delivery.controller.js      # Atiende la carga de comprobantes de entrega.
│   │   ├── product.controller.js       # Atiende las solicitudes HTTP de productos.
│   │   └── user.controller.js          # Atiende las solicitudes HTTP de usuarios.
│   ├── errors/
│   │   ├── app.error.js                # Crea errores personalizados a partir de códigos.
│   │   └── error.dictionary.js         # Mapea códigos de error a estados y mensajes.
│   ├── middlewares/
│   │   ├── error.middleware.js         # Devuelve las respuestas de error en formato común.
│   │   └── not-found.middleware.js     # Convierte rutas inexistentes en ROUTE_NOT_FOUND.
│   ├── models/
│   │   ├── delivery.model.js           # Define entregas, referencias y comprobantes asociados.
│   │   ├── order.model.js              # Define pedidos, referencia al usuario y comprobantes.
│   │   ├── upload-metadata.schema.js   # Define metadatos asociados a archivos cargados.
│   │   ├── product.model.js            # Define el esquema de productos.
│   │   └── user.model.js               # Define usuarios, roles y documentos asociados.
│   ├── repositories/
│   │   ├── delivery.repository.js      # Consulta entregas y asocia comprobantes.
│   │   ├── mock.repository.js          # Inserta usuarios, pedidos y entregas simulados.
│   │   ├── order.repository.js         # Consulta pedidos y asocia metadatos de comprobantes.
│   │   ├── product.repository.js       # Consulta productos y selecciona sus campos.
│   │   └── user.repository.js          # Consulta usuarios y selecciona sus campos.
│   ├── routes/
│   │   ├── delivery.routes.js          # Publica la carga de comprobantes de entrega.
│   │   ├── logger.routes.js            # Conecta /api/logger/test con su Controller.
│   │   ├── mock.routes.js              # Conecta /api/mocks con su Controller.
│   │   ├── order.routes.js             # Publica pedidos y su ruta de carga de comprobantes.
│   │   ├── product.routes.js           # Conecta /api/products con su Controller.
│   │   └── user.routes.js              # Conecta /api/users con su Controller.
│   └── services/
│       ├── delivery.service.js         # Valida entregas y asocia metadatos del comprobante.
│       ├── file-metadata.service.js    # Construye metadatos y limpia archivos temporales.
│       ├── mock-data.factory.js        # Genera usuarios, repartidores, pedidos y entregas.
│       ├── mock.service.js             # Valida qty y coordina la generación y carga de mocks.
│       ├── order.service.js            # Aplica reglas de negocio y asocia comprobantes.
│       ├── pagination.service.js       # Valida page/limit y arma metadatos de paginación.
│       ├── product.service.js          # Aplica reglas de negocio para productos.
│       └── user.service.js             # Prepara los datos de usuarios para la respuesta.
├── tests/
│   ├── setup.js                        # Configura la base aislada para pruebas.
│   ├── errors.test.js                  # Prueba errores documentados y respuestas centralizadas.
│   ├── users.test.js                   # Pruebas funcionales de usuarios.
│   ├── orders.test.js                  # Pruebas funcionales de pedidos.
│   ├── deliveries.test.js              # Pruebas funcionales de entregas.
│   ├── mocks.test.js                   # Pruebas funcionales de generación y carga.
│   ├── platform.test.js                # Pruebas funcionales de logger y Swagger.
│   ├── smoke.test.js                   # Prueba de humo del servidor y la especificación.
│   └── uploads.test.js                 # Pruebas funcionales de documentos y comprobantes.
├── .env.example                        # Plantilla de variables de entorno sin datos privados.
├── .dockerignore                       # Excluye archivos locales y generados de la imagen.
├── Dockerfile                          # Construye y ejecuta la API como contenedor.
├── .gitignore                          # Excluye .env, node_modules y otros archivos locales.
├── package.json                        # Declara dependencias y comandos del proyecto.
├── package-lock.json                   # Registra las versiones instaladas de dependencias.
└── README.md                           # Documentación del proyecto.
```
