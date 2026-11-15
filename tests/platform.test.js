const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");

describe("Logger y documentación", function () {
  it("GET /api/logger/test confirma que registró los niveles", async function () {
    const response = await request(app).get("/api/logger/test");

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal("Se registraron los niveles del logger");
  });

  it("GET /api/docs muestra Swagger UI", async function () {
    const response = await request(app).get("/api/docs/");

    expect(response.status).to.equal(200);
    expect(response.text).to.include("Swagger UI");
    expect(response.text).to.include("swagger-ui-init.js");
  });
});
