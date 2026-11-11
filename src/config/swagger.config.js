const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "ShipNow API",
      version: "1.0.0",
      description:
        "API backend de ShipNow para gestionar usuarios, pedidos y entregas, generar datos de prueba y validar el logger.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Users", description: "Operaciones de usuarios" },
      { name: "Orders", description: "Operaciones de pedidos" },
      { name: "Products", description: "Consulta de productos disponibles" },
      { name: "Deliveries", description: "Operaciones de entregas" },
      { name: "Mocks", description: "Generación y carga de datos de prueba" },
      { name: "Logger", description: "Herramienta de validación del logger" },
    ],

    components: {
      schemas: {
        MockDataset: {
          type: "object",
          properties: {
            users: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            couriers: {
              type: "array",
              items: { $ref: "#/components/schemas/User" },
            },
            orders: {
              type: "array",
              items: { $ref: "#/components/schemas/Order" },
            },
            deliveries: {
              type: "array",
              items: { $ref: "#/components/schemas/Delivery" },
            },
          },
        },
        SeedResponse: {
          type: "object",
          properties: {
            insertados: {
              type: "object",
              properties: {
                usuarios: { type: "integer", example: 2 },
                repartidores: { type: "integer", example: 2 },
                pedidos: { type: "integer", example: 2 },
                entregas: { type: "integer", example: 2 },
              },
            },
          },
        },

        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "507f1f77bcf86cd799439011" },
            name: { type: "string", example: "Ana Pérez" },
            email: {
              type: "string",
              format: "email",
              example: "ana@shipnow.test",
            },
            role: { type: "string", enum: ["ADMIN", "USER", "COURIER"] },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            description: { type: "string" },
            price: { type: "number", minimum: 0 },
            stock: { type: "integer", minimum: 0 },
            status: { type: "string", enum: ["AVAILABLE", "OUT_OF_STOCK"] },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: {
              type: "string",
              description: "ID del usuario que realizó el pedido",
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "ASSIGNED",
                "IN_TRANSIT",
                "DELIVERED",
                "CANCELLED",
              ],
            },
            priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
            destination: { type: "string" },
          },
        },
        Delivery: {
          type: "object",
          properties: {
            _id: { type: "string" },
            order: { type: "string", description: "ID del pedido asociado" },
            courier: {
              type: "string",
              nullable: true,
              description:
                "ID del repartidor o null si todavía no está asignado",
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "ASSIGNED",
                "IN_TRANSIT",
                "DELIVERED",
                "FAILED",
              ],
            },
          },
        },
        OrderItem: {
          type: "object",
          description:
            "Esquema reutilizable de un ítem; los modelos actuales todavía no lo incluyen dentro de Order.",
          properties: {
            product: { type: "string", description: "ID del producto" },
            quantity: { type: "integer", minimum: 1 },
            unitPrice: { type: "number", minimum: 0 },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            error: {
              type: "object",
              properties: {
                code: { type: "string", example: "INVALID_MOCK_QTY" },
                message: {
                  type: "string",
                },
              },
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;
