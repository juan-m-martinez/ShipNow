const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const swaggerSpec = require("../src/config/swagger.config");

describe("Prueba de humo", function () {
  it("levanta el servidor y sirve Swagger UI en /api/docs", async function () {
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));

    try {
      const response = await request(server).get("/api/docs/");
      expect(response.status).to.equal(200);
      expect(response.text).to.include("Swagger UI");
    } finally {
      await new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      );
    }
  });

  it("incluye operaciones para los cinco módulos principales en OpenAPI", function () {
    const tags = new Set(
      Object.values(swaggerSpec.paths)
        .flatMap((pathItem) => Object.values(pathItem))
        .flatMap((operation) => operation.tags || []),
    );
    const mainModules = ["Users", "Orders", "Deliveries", "Mocks", "Logger"];

    for (const moduleTag of mainModules) {
      expect(tags.has(moduleTag), `falta una operación para ${moduleTag}`).to.equal(true);
    }
    expect(swaggerSpec.paths).to.have.property("/api/mocks/users");
    expect(swaggerSpec.paths).to.have.property("/api/orders");
    expect(swaggerSpec.paths).to.have.property("/api/deliveries");
  });
});
