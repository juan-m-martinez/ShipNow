const express = require("express");
const deliveryController = require("../controllers/delivery.controller");
const { deliveryProofUpload } = require("../config/upload.config");

const router = express.Router();

/**
 * @openapi
 * /api/deliveries:
 *   get:
 *     tags: [Deliveries]
 *     summary: Listar entregas
 *     description: Devuelve una página de entregas. Por defecto muestra 20 y admite hasta 100 por página.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       "200":
 *         description: Lista de entregas.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deliveries:
 *                   type: array
 *                   items: { $ref: "#/components/schemas/Delivery" }
 *                 pagination:
 *                   $ref: "#/components/schemas/Pagination"
 *       "400":
 *         description: Parámetros page o limit inválidos.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       "500":
 *         description: Error interno.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *   post:
 *     tags: [Deliveries]
 *     summary: Crear entrega
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order]
 *             properties:
 *               order: { type: string, description: ID de un pedido existente }
 *               courier: { type: string, nullable: true, description: ID de un usuario con rol COURIER }
 *               status: { type: string, enum: [PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, FAILED] }
 *     responses:
 *       "201":
 *         description: Entrega creada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery: { $ref: "#/components/schemas/Delivery" }
 *       "400":
 *         description: Datos o estado inválidos.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       "404":
 *         description: Pedido o repartidor inexistente.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 */
router.get("/", deliveryController.getDeliveries);
router.post("/", deliveryController.createDelivery);

/**
 * @openapi
 * /api/deliveries/{deliveryId}:
 *   get:
 *     tags: [Deliveries]
 *     summary: Obtener entrega por ID
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200":
 *         description: Entrega encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery: { $ref: "#/components/schemas/Delivery" }
 *       "404":
 *         description: Entrega inexistente.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *   patch:
 *     tags: [Deliveries]
 *     summary: Actualizar estado o repartidor de una entrega
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courier: { type: string, nullable: true }
 *               status: { type: string, enum: [PENDING, ASSIGNED, IN_TRANSIT, DELIVERED, FAILED] }
 *     responses:
 *       "200":
 *         description: Entrega actualizada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery: { $ref: "#/components/schemas/Delivery" }
 *       "400":
 *         description: Datos o estado inválidos.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *       "404":
 *         description: Entrega o repartidor inexistente.
 *         content:
 *           application/json:
 *             schema: { $ref: "#/components/schemas/ErrorResponse" }
 *   delete:
 *     tags: [Deliveries]
 *     summary: Eliminar una entrega
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       "200":
 *         description: Entrega eliminada.
 *       "404":
 *         description: Entrega inexistente.
 */
router.get("/:deliveryId", deliveryController.getDeliveryById);
router.patch("/:deliveryId", deliveryController.updateDelivery);
router.delete("/:deliveryId", deliveryController.deleteDelivery);

/**
 * @openapi
 * /api/deliveries/{deliveryId}/proof:
 *   post:
 *     tags:
 *       - Deliveries
 *     summary: Cargar comprobante de entrega
 *     description: Guarda un PDF, JPG o PNG de hasta 5 MB en el campo proof y asocia sus metadatos a la entrega. El backend asigna DELIVERY_RECEIPT; no se envía proofType.
 *     parameters:
 *       - in: path
 *         name: deliveryId
 *         required: true
 *         schema:
 *           type: string
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
 *                 description: Comprobante PDF, JPG o PNG; máximo 5 MB.
 *     responses:
 *       "201":
 *         description: Comprobante guardado y asociado a la entrega.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 delivery:
 *                   $ref: "#/components/schemas/Delivery"
 *       "400":
 *         description: Falta el archivo o el campo enviado es inválido.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "404":
 *         description: Entrega inexistente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "413":
 *         description: El archivo supera 5 MB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "500":
 *         description: Error al guardar el archivo o sus metadatos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post(
  "/:deliveryId/proof",
  deliveryController.ensureDeliveryExists,
  deliveryProofUpload.single("proof"),
  deliveryController.uploadProof,
);

module.exports = router;
