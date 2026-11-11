const express = require("express");
const productController = require("../controllers/product.controller");

const router = express.Router();

/**
 * @openapi
 * /api/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Listar productos disponibles
 *     description: Devuelve productos con estado AVAILABLE.
 *     responses:
 *       "200":
 *         description: Lista de productos disponibles.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Product"
 *       "500":
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

router.get("/", productController.getAvailableProducts);

module.exports = router;
