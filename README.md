# ShipNow API

## Descripción

API REST desarrollada con Node.js, Express y MongoDB, implementada utilizando una arquitectura por capas.

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

## Arquitectura de carpetas

```text
src/
├── config/
├── constants/
├── controllers/
├── services/
├── repositories/
├── models/
└── routes/
```
