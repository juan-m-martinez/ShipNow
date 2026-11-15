const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

/**
 * @openapi
 * /api/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Listar pedidos
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

module.exports = router;
