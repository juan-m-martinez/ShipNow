const { expect } = require("chai");
const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");
const { USER_ROLE, DELIVERY_STATUS } = require("../src/constants");

const createDelivery = async () => {
  const user = await User.create({
    name: "Cliente",
    email: `cliente-${Date.now()}-${Math.random()}@deliveries.test`,
    role: USER_ROLE.USER,
  });
  const order = await Order.create({ user: user.id, destination: "Calle 123" });
  return Delivery.create({ order: order.id });
};

describe("Deliveries API", function () {
  it("lista entregas y permite obtener una por ID", async function () {
    const delivery = await createDelivery();

    const list = await request(app).get("/api/deliveries");
    const detail = await request(app).get(`/api/deliveries/${delivery.id}`);

    expect(list.status).to.equal(200);
    expect(list.body.deliveries).to.have.lengthOf(1);
    expect(detail.status).to.equal(200);
    expect(detail.body.delivery._id).to.equal(delivery.id);
  });

  it("crea una entrega vinculada a un pedido existente", async function () {
    const user = await User.create({
      name: "Cliente",
      email: `cliente-${Date.now()}-${Math.random()}@deliveries.test`,
      role: USER_ROLE.USER,
    });
    const order = await Order.create({ user: user.id, destination: "Calle 123" });
    const courier = await User.create({
      name: "Repartidor",
      email: `courier-${Date.now()}-${Math.random()}@deliveries.test`,
      role: USER_ROLE.COURIER,
    });

    const response = await request(app).post("/api/deliveries").send({
      order: order.id,
      courier: courier.id,
      status: DELIVERY_STATUS.ASSIGNED,
    });

    expect(response.status).to.equal(201);
    expect(response.body.delivery.order).to.equal(order.id);
    expect(response.body.delivery.courier).to.equal(courier.id);
    expect(response.body.delivery.status).to.equal(DELIVERY_STATUS.ASSIGNED);
  });

  it("actualiza el estado y elimina una entrega", async function () {
    const delivery = await createDelivery();

    const updated = await request(app)
      .patch(`/api/deliveries/${delivery.id}`)
      .send({ status: DELIVERY_STATUS.IN_TRANSIT });
    expect(updated.status).to.equal(200);
    expect(updated.body.delivery.status).to.equal(DELIVERY_STATUS.IN_TRANSIT);

    const deleted = await request(app).delete(`/api/deliveries/${delivery.id}`);
    expect(deleted.status).to.equal(200);
    expect(deleted.body.message).to.equal("Entrega eliminada");
    expect(await Delivery.countDocuments()).to.equal(0);
  });

  it("valida el pedido relacionado y el estado de la entrega", async function () {
    const missingOrder = await request(app).post("/api/deliveries").send({
      order: "507f1f77bcf86cd799439011",
    });
    expect(missingOrder.status).to.equal(404);
    expect(missingOrder.body.error.code).to.equal("ORDER_NOT_FOUND");

    const delivery = await createDelivery();
    const invalidStatus = await request(app)
      .patch(`/api/deliveries/${delivery.id}`)
      .send({ status: "INVALID" });
    expect(invalidStatus.status).to.equal(400);
    expect(invalidStatus.body.error.code).to.equal("INVALID_DELIVERY_STATUS");
  });
});
