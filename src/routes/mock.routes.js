const express = require("express");
const mockController = require("../controllers/mock.controller");

const router = express.Router();

/**
 * @openapi
 * /api/mocks/users:
 *   get:
 *     tags:
 *  - Mocks
 *  - Orders
 *  - Deliveries
 *     summary: Generar usuarios de prueba
 *     description: Devuelve usuarios simulados sin guardarlos en MongoDB.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de usuarios a generar.
 *     responses:
 *       "200":
 *         description: Usuarios simulados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       "400":
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "422":
 *         description: Falló la generación de datos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /api/mocks/couriers:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar repartidores de prueba
 *     description: Devuelve repartidores simulados sin guardarlos en MongoDB.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de repartidores a generar.
 *     responses:
 *       "200":
 *         description: Repartidores simulados.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       "400":
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "422":
 *         description: Falló la generación de datos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /api/mocks/data:
 *   get:
 *     tags:
 *       - Mocks
 *     summary: Generar un conjunto de datos relacionado
 *     description: Genera usuarios, repartidores, pedidos y entregas simulados en memoria, sin persistirlos.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de usuarios, repartidores y pedidos a generar.
 *     responses:
 *       "200":
 *         description: Conjunto relacionado de datos simulados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MockDataset"
 *       "400":
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "422":
 *         description: Falló la generación de datos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

/**
 * @openapi
 * /api/mocks/seed:
 *   post:
 *     tags:
 *       - Mocks
 *     summary: Insertar datos de prueba
 *     description: Genera y guarda usuarios, repartidores, pedidos y entregas relacionados en MongoDB.
 *     parameters:
 *       - in: query
 *         name: qty
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Cantidad de registros de cada tipo.
 *     responses:
 *       "201":
 *         description: Cantidades insertadas por tipo.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SeedResponse"
 *       "400":
 *         description: Cantidad inválida.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "422":
 *         description: Falló la generación de datos.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       "500":
 *         description: Falló la persistencia en MongoDB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

router.get("/users", mockController.getMockUsers);
router.get("/couriers", mockController.getMockCouriers);
router.get("/data", mockController.getMockDataset);
router.post("/seed", mockController.seedMockDataset);

module.exports = router;
