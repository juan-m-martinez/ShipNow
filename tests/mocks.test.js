const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");
const { USER_ROLE, ORDER_STATUS } = require("../src/constants");

describe("Mocks API", function () {
  it("genera usuarios simulados sin guardarlos", async function () {
    const response = await request(app).get("/api/mocks/users?qty=2");

    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(2);
    expect(response.body[0].role).to.equal(USER_ROLE.USER);
    expect(await User.countDocuments()).to.equal(0);
  });

  it("responde con error ante una cantidad inválida", async function () {
    const response = await request(app).get("/api/mocks/users?qty=-1");

    expect(response.status).to.equal(400);
    expect(response.body.status).to.equal("error");
    expect(response.body.error.code).to.equal("INVALID_MOCK_QTY");
  });

  it("genera pedidos y entregas relacionados", async function () {
    const response = await request(app).get("/api/mocks/data?qty=3");

    expect(response.status).to.equal(200);

    const { users, couriers, orders, deliveries } = response.body;
    const userIds = users.map((user) => user._id);
    const courierIds = couriers.map((courier) => courier._id);
    const orderIds = orders.map((order) => order._id);

    expect(orders).to.have.lengthOf(3);
    expect(deliveries).to.have.lengthOf(3);
    expect(users.every((user) => user.role === USER_ROLE.USER)).to.equal(true);
    expect(
      couriers.every((courier) => courier.role === USER_ROLE.COURIER),
    ).to.equal(true);
    expect(orders.every((order) => userIds.includes(order.user))).to.equal(
      true,
    );
    expect(
      deliveries.every((delivery) => orderIds.includes(delivery.order)),
    ).to.equal(true);
    expect(
      deliveries.every(
        (delivery) =>
          delivery.courier === null || courierIds.includes(delivery.courier),
      ),
    ).to.equal(true);
    expect(
      orders.every((order) =>
        Object.values(ORDER_STATUS).includes(order.status),
      ),
    ).to.equal(true);

    expect(await User.countDocuments()).to.equal(0);
  });

  it("inserta el conjunto de prueba en la base de pruebas", async function () {
    const response = await request(app).post("/api/mocks/seed?qty=2");

    expect(response.status).to.equal(201);
    expect(response.body.insertados).to.deep.equal({
      usuarios: 2,
      repartidores: 2,
      pedidos: 2,
      entregas: 2,
    });
    expect(await User.countDocuments()).to.equal(4);
    expect(await Order.countDocuments()).to.equal(2);
    expect(await Delivery.countDocuments()).to.equal(2);
  });
});
