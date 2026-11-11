const { randomBytes } = require("node:crypto");
const { fakerES: faker } = require("@faker-js/faker");
const {
  USER_ROLE,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
} = require("../constants");

const createId = () => randomBytes(12).toString("hex");

const generateMockUsers = (qty, role = USER_ROLE.USER) => {
  return Array.from({ length: qty }, () => {
    const id = createId();

    return {
      _id: id,
      name: faker.person.fullName(),
      email: `${id}@shipnow.test`,
      role,
    };
  });
};

const generateMockOrders = (qty, users) => {
  const customers = users.filter((user) => user.role === USER_ROLE.USER);

  if (qty > 0 && customers.length === 0) {
    throw new Error(
      "Se necesita al menos un usuario con rol USER para generar pedidos.",
    );
  }

  return Array.from({ length: qty }, () => {
    const user = faker.helpers.arrayElement(customers);

    return {
      _id: createId(),
      user: user._id,
      status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
      priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
      destination: faker.location.streetAddress(),
    };
  });
};

const generateMockDeliveries = (orders, couriers) => {
  const availableCouriers = couriers.filter(
    (courier) => courier.role === USER_ROLE.COURIER,
  );

  const deliveryStatusByOrder = {
    [ORDER_STATUS.PENDING]: DELIVERY_STATUS.PENDING,
    [ORDER_STATUS.ASSIGNED]: DELIVERY_STATUS.ASSIGNED,
    [ORDER_STATUS.IN_TRANSIT]: DELIVERY_STATUS.IN_TRANSIT,
    [ORDER_STATUS.DELIVERED]: DELIVERY_STATUS.DELIVERED,
    [ORDER_STATUS.CANCELLED]: DELIVERY_STATUS.FAILED,
  };

  return orders.map((order) => {
    const requiresCourier = [
      ORDER_STATUS.ASSIGNED,
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.DELIVERED,
    ].includes(order.status);

    if (requiresCourier && availableCouriers.length === 0) {
      throw new Error(
        "Se necesita al menos un usuario con rol COURIER para estas entregas.",
      );
    }

    const courier = requiresCourier
      ? faker.helpers.arrayElement(availableCouriers)
      : null;

    return {
      _id: createId(),
      order: order._id,
      courier: courier ? courier._id : null,
      status: deliveryStatusByOrder[order.status],
    };
  });
};

module.exports = {
  generateMockUsers,
  generateMockOrders,
  generateMockDeliveries,
};
