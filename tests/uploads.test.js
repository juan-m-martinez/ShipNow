const { expect } = require("chai");
const fs = require("node:fs");
const path = require("node:path");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");
const { USER_ROLE, USER_DOCUMENT_TYPE, DELIVERY_PROOF_TYPE } = require("../src/constants");

const testUploadsDirectory = path.resolve(__dirname, "../.test-uploads");
const pdfFile = Buffer.from("%PDF-1.4\nShipNow test file\n%%EOF");
const uploadDocument = (userId, documentType = USER_DOCUMENT_TYPE.IDENTITY) =>
  request(app)
    .post(`/api/users/${userId}/documents`)
    .field("documentType", documentType)
    .attach("document", pdfFile, {
      filename: "identidad.pdf",
      contentType: "application/pdf",
    });

const createUser = () =>
  User.create({
    name: "Ana Pérez",
    email: `ana-${Date.now()}-${Math.random()}@uploads.test`,
    role: USER_ROLE.USER,
  });

describe("Carga de documentos y comprobantes", function () {
  it("guarda el documento del usuario y sus metadatos", async function () {
    const user = await createUser();
    const response = await uploadDocument(user.id);

    expect(response.status).to.equal(201);
    const metadata = response.body.user.documents[0];
    expect(metadata).to.include({
      originalName: "identidad.pdf",
      mimeType: "application/pdf",
      documentType: USER_DOCUMENT_TYPE.IDENTITY,
    });
    expect(metadata.generatedName).to.not.equal(metadata.originalName);
    expect(metadata.size).to.equal(pdfFile.length);
    expect(metadata.uploadedAt).to.be.a("string");
    expect(fs.existsSync(path.join(testUploadsDirectory, metadata.path))).to.equal(true);
    expect(await User.countDocuments({ _id: user.id, "documents.0": { $exists: true } })).to.equal(1);
  });

  it("devuelve un error centralizado cuando falta el archivo", async function () {
    const user = await createUser();
    const response = await request(app)
      .post(`/api/users/${user.id}/documents`)
      .field("documentType", USER_DOCUMENT_TYPE.IDENTITY);

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("FILE_REQUIRED");
  });

  it("rechaza un tipo de documento no permitido y elimina el archivo temporal", async function () {
    const user = await createUser();
    const response = await uploadDocument(user.id, "NOT_A_DOCUMENT_TYPE");

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_DOCUMENT_TYPE");
    expect(response.body.status).to.equal("error");
    expect(await User.countDocuments({ _id: user.id, "documents.0": { $exists: true } })).to.equal(0);
  });

  it("rechaza archivos con una extensión o tipo MIME no permitido", async function () {
    const user = await createUser();
    const response = await request(app)
      .post(`/api/users/${user.id}/documents`)
      .field("documentType", USER_DOCUMENT_TYPE.IDENTITY)
      .attach("document", Buffer.from("plain text"), {
        filename: "nota.txt",
        contentType: "text/plain",
      });

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_FILE_TYPE");
  });

  it("rechaza un campo de archivo distinto al esperado", async function () {
    const user = await createUser();
    const response = await request(app)
      .post(`/api/users/${user.id}/documents`)
      .field("documentType", USER_DOCUMENT_TYPE.IDENTITY)
      .attach("wrongField", pdfFile, {
        filename: "identidad.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_FILE_FIELD");
  });

  it("rechaza archivos que superan el límite de 5 MB", async function () {
    const user = await createUser();
    const oversized = Buffer.alloc(5 * 1024 * 1024 + 1, 65);
    const response = await request(app)
      .post(`/api/users/${user.id}/documents`)
      .field("documentType", USER_DOCUMENT_TYPE.IDENTITY)
      .attach("document", oversized, {
        filename: "grande.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).to.equal(413);
    expect(response.body.error.code).to.equal("FILE_TOO_LARGE");
  });

  it("guarda el comprobante en la entrega y reporta cuando la entrega no existe", async function () {
    const user = await createUser();
    const order = await Order.create({ user: user.id, destination: "Calle 123" });
    const delivery = await Delivery.create({ order: order.id });

    const success = await request(app)
      .post(`/api/deliveries/${delivery.id}/proof`)
      .attach("proof", pdfFile, {
        filename: "comprobante.pdf",
        contentType: "application/pdf",
      });

    expect(success.status).to.equal(201);
    expect(success.body.delivery.proofs).to.have.lengthOf(1);
    expect(success.body.delivery.proofs[0].documentType).to.equal(DELIVERY_PROOF_TYPE.RECEIPT);

    const missing = await request(app).post("/api/deliveries/507f1f77bcf86cd799439011/proof");
    expect(missing.status).to.equal(404);
    expect(missing.body.error.code).to.equal("DELIVERY_NOT_FOUND");
  });
});
