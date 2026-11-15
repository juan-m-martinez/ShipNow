const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Order = require("../src/models/order.model");
const { USER_ROLE, ORDER_STATUS, ORDER_PRIORITY } = require("../src/constants");

const createUser = () =>
  User.create({ name: "Ana Pérez", email: "ana@orders.test", role: USER_ROLE.USER });

describe("Orders API", function () {
  it("GET /api/orders devuelve la lista de pedidos", async function () {
    const user = await createUser();
    await Order.create({ user: user._id, destination: "Calle 123" });

    const response = await request(app).get("/api/orders");

    expect(response.status).to.equal(200);
    expect(response.body.orders).to.have.lengthOf(1);
    expect(response.body.orders[0].destination).to.equal("Calle 123");
  });

  it("POST /api/orders crea un pedido para un usuario existente", async function () {
    const user = await createUser();

    const response = await request(app).post("/api/orders").send({
      user: user.id,
      destination: "Av. Siempre Viva 742",
      priority: ORDER_PRIORITY.HIGH,
    });

    expect(response.status).to.equal(201);
    expect(response.body.order.user).to.equal(user.id);
    expect(response.body.order.status).to.equal(ORDER_STATUS.PENDING);
    expect(response.body.order.priority).to.equal(ORDER_PRIORITY.HIGH);
  });

  it("rechaza la creación cuando los datos son inválidos", async function () {
    const response = await request(app).post("/api/orders").send({
      user: "id-invalido",
      destination: "",
    });

    expect(response.status).to.equal(400);
    expect(response.body.error.code).to.equal("INVALID_DATA");
  });

  it("GET /api/orders/:orderId devuelve el pedido encontrado", async function () {
    const user = await createUser();
    const order = await Order.create({ user: user._id, destination: "Calle 123" });

    const response = await request(app).get(`/api/orders/${order.id}`);

    expect(response.status).to.equal(200);
    expect(response.body.order._id).to.equal(order.id);
  });

  it("devuelve 404 si el pedido no existe", async function () {
    const response = await request(app).get("/api/orders/507f1f77bcf86cd799439011");

    expect(response.status).to.equal(404);
    expect(response.body.error.code).to.equal("ORDER_NOT_FOUND");
  });

  it("actualiza el estado y rechaza valores inválidos", async function () {
    const user = await createUser();
    const order = await Order.create({ user: user._id, destination: "Calle 123" });

    const updated = await request(app)
      .patch(`/api/orders/${order.id}/status`)
      .send({ status: ORDER_STATUS.IN_TRANSIT });

    expect(updated.status).to.equal(200);
    expect(updated.body.order.status).to.equal(ORDER_STATUS.IN_TRANSIT);

    const invalid = await request(app)
      .patch(`/api/orders/${order.id}/status`)
      .send({ status: "INVALID" });

    expect(invalid.status).to.equal(400);
    expect(invalid.body.error.code).to.equal("INVALID_ORDER_STATUS");
  });
});
