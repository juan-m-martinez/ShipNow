const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const userService = require("../src/services/user.service");
const mockFactory = require("../src/services/mock-data.factory");

describe("Errores documentados de la API", function () {
  it("responde ROUTE_NOT_FOUND para una ruta inexistente", async function () {
    const response = await request(app).get("/api/esta-ruta-no-existe");

    expect(response.status).to.equal(404);
    expect(response.body.status).to.equal("error");
    expect(response.body.error.code).to.equal("ROUTE_NOT_FOUND");
  });

  it("responde USER_NOT_FOUND al crear un pedido para un usuario inexistente", async function () {
    const response = await request(app).post("/api/orders").send({
      user: "507f1f77bcf86cd799439011",
      destination: "Calle 123",
    });

    expect(response.status).to.equal(404);
    expect(response.body.error.code).to.equal("USER_NOT_FOUND");
  });

  it("responde INVALID_DATA si el ID del pedido no tiene formato válido", async function () {
    const response = await request(app).get("/api/orders/id-invalido");

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_DATA");
  });

  it("responde INTERNAL_SERVER_ERROR con el formato común ante un fallo inesperado", async function () {
    const originalGetAllUsers = userService.getAllUsers;
    userService.getAllUsers = async () => {
      throw new Error("Fallo inesperado de prueba");
    };

    try {
      const response = await request(app).get("/api/users");
      expect(response.status).to.equal(500);
      expect(response.body.status).to.equal("error");
      expect(response.body.error.code).to.equal("INTERNAL_SERVER_ERROR");
    } finally {
      userService.getAllUsers = originalGetAllUsers;
    }
  });

  it("responde MOCK_GENERATION_FAILED si falla la generación simulada", async function () {
    const originalGenerateOrders = mockFactory.generateMockOrders;
    mockFactory.generateMockOrders = () => {
      throw new Error("Fallo de generación de prueba");
    };

    try {
      const response = await request(app).get("/api/mocks/data?qty=1");
      expect(response.status).to.equal(422);
      expect(response.body.error.code).to.equal("MOCK_GENERATION_FAILED");
    } finally {
      mockFactory.generateMockOrders = originalGenerateOrders;
    }
  });

  it("responde MOCK_PERSISTENCE_FAILED si MongoDB falla al guardar mocks", async function () {
    const originalInsertMany = User.insertMany;
    User.insertMany = async () => {
      throw new Error("Fallo de persistencia de prueba");
    };

    try {
      const response = await request(app).post("/api/mocks/seed?qty=1");
      expect(response.status).to.equal(500);
      expect(response.body.error.code).to.equal("MOCK_PERSISTENCE_FAILED");
    } finally {
      User.insertMany = originalInsertMany;
    }
  });
});
