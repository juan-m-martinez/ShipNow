const express = require("express");
const orderController = require("../controllers/order.controller");
const { orderProofUpload } = require("../config/upload.config");

const router = express.Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Listar pedidos
 *     description: Devuelve una página de pedidos. Por defecto muestra 20 y admite hasta 100 por página.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       "200":
 *         description: Lista de pedidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Order"
 *                 pagination:
 *                   $ref: "#/components/schemas/Pagination"
 *       "400":
 *         description: Parámetros page o limit inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "500":
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *   post:
 *     tags:
 *       - Orders
 *     summary: Crear pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user, destination]
 *             properties:
 *               user:
 *                 type: string
 *                 description: ID de un usuario existente.
 *               destination:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *     responses:
 *       "201":
 *         description: Pedido creado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: "#/components/schemas/Order"
 *       "400":
 *         description: Datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Usuario inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "500":
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get("/", orderController.getOrders);
router.post("/", orderController.createOrder);

/**
 * @openapi
 * /api/orders/{orderId}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Obtener pedido por ID
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Pedido encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: "#/components/schemas/Order"
 *       "400":
 *         description: ID inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Pedido inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *   put:
 *     tags:
 *       - Orders
 *     summary: Actualizar un pedido
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user: { type: string }
 *               destination: { type: string }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *               status: { type: string, enum: [PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED] }
 *     responses:
 *       "200":
 *         description: Pedido actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order: { $ref: "#/components/schemas/Order" }
 *       "400":
 *         description: ID o datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Pedido o usuario inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *   delete:
 *     tags:
 *       - Orders
 *     summary: Eliminar un pedido
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: Pedido eliminado.
 *       "404":
 *         description: Pedido inexistente.
 */
router.get("/:orderId", orderController.getOrderById);
router.put("/:orderId", orderController.updateOrder);
router.delete("/:orderId", orderController.deleteOrder);

/**
 * @openapi
 * /api/orders/{orderId}/status:
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Actualizar estado de un pedido
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, CANCELLED]
 *     responses:
 *       "200":
 *         description: Estado actualizado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: "#/components/schemas/Order"
 *       "400":
 *         description: ID o estado inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Pedido inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.patch("/:orderId/status", orderController.updateOrderStatus);

/**
 * @openapi
 * /api/orders/{orderId}/proof:
 *   post:
 *     tags: [Orders]
 *     summary: Cargar comprobante de pedido
 *     description: Recibe un archivo PDF, JPG o PNG de hasta 5 MB en el campo proof. El backend asigna ORDER_RECEIPT; no se envía proofType.
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [proof]
 *             properties:
 *               proof:
 *                 type: string
 *                 format: binary
 *                 description: Archivo PDF, JPG o PNG; máximo 5 MB.
 *     responses:
 *       "201":
 *         description: Comprobante asociado al pedido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order: { $ref: "#/components/schemas/Order" }
 *       "400":
 *         description: Archivo faltante o campo/formato inválido.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       "404":
 *         description: Pedido inexistente.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       "413":
 *         description: Archivo superior a 5 MB.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       "500":
 *         description: Error al guardar archivo o metadatos.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
router.post(
  "/:orderId/proof",
  orderController.ensureOrderExists,
  orderProofUpload.single("proof"),
  orderController.uploadProof,
);

module.exports = router;
