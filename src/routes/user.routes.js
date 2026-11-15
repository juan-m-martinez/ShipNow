const express = require("express");
const userController = require("../controllers/user.controller");
const { userDocumentUpload } = require("../config/upload.config");

const router = express.Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Listar usuarios
 *     description: Devuelve los usuarios registrados.
 *     responses:
 *       "200":
 *         description: Lista de usuarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *       "500":
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */

router.get("/", userController.getAllUsers);

/**
 * @openapi
 * /api/users/{userId}/documents:
 *   post:
 *     tags:
 *       - Users
 *     summary: Cargar documento de usuario
 *     description: Guarda un PDF, JPG o PNG en el servidor y asocia sus metadatos al usuario.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [document, documentType]
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Archivo PDF, JPG o PNG; máximo 5 MB.
 *               documentType:
 *                 type: string
 *                 enum: [IDENTITY, DRIVER_LICENSE, ADDRESS_PROOF]
 *     responses:
 *       "201":
 *         description: Documento guardado y asociado al usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *       "400":
 *         description: Falta el archivo o el tipo/campo enviado es inválido.
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
  "/:userId/documents",
  userController.ensureUserExists,
  userDocumentUpload.single("document"),
  userController.uploadDocument,
);

module.exports = router;
