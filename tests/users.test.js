const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const { USER_ROLE } = require("../src/constants");

describe("Users API", function () {
  it("GET /api/users devuelve los usuarios guardados", async function () {
    await User.create({
      name: "Ana Pérez",
      email: "ana@test.com",
      role: USER_ROLE.USER,
    });

    const response = await request(app).get("/api/users");

    expect(response.status).to.equal(200);
    expect(response.body.users).to.have.lengthOf(1);
    expect(response.body.users[0]).to.include({
      name: "Ana Pérez",
      email: "ana@test.com",
      role: USER_ROLE.USER,
    });
  });
});
