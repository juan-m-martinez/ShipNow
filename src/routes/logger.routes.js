const express = require("express");
const { testLogger } = require("../controllers/logger.controller");

const router = express.Router();

/**
 * @openapi
 * /api/logger/test:
 *   get:
 *     tags:
 *       - Logger
 *     summary: Validar los niveles del logger
 *     description: Herramienta de validación; no realiza una operación de negocio. Emite eventos DEBUG, HTTP, INFO, WARNING, ERROR y FATAL.
 *     responses:
 *       "200":
 *         description: Los niveles del logger fueron registrados.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/SuccessResponse"
 *       "500":
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

router.get("/test", testLogger);

module.exports = router;
