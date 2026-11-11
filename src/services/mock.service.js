const mockFactory = require("./mock-data.factory");
const mockRepository = require("../repositories/mock.repository");
const { USER_ROLE } = require("../constants");

const getMockUsers = (qty) => {
  return mockFactory.generateMockUsers(qty, USER_ROLE.USER);
};

const getMockCouriers = (qty) => {
  return mockFactory.generateMockUsers(qty, USER_ROLE.COURIER);
};

const createMockDataset = (qty) => {
  const users = getMockUsers(qty);
  const couriers = getMockCouriers(qty);
  const orders = mockFactory.generateMockOrders(qty, users);
  const deliveries = mockFactory.generateMockDeliveries(orders, couriers);

  return { users, couriers, orders, deliveries };
};

const getMockDataset = (qty) => createMockDataset(qty);

const seedMockDataset = async (qty) => {
  const dataset = createMockDataset(qty);

  const saved = await mockRepository.saveMockDataset({
    users: [...dataset.users, ...dataset.couriers],
    orders: dataset.orders,
    deliveries: dataset.deliveries,
  });

  return {
    insertados: {
      usuarios: dataset.users.length,
      repartidores: dataset.couriers.length,
      pedidos: saved.orders,
      entregas: saved.deliveries,
    },
  };
};

module.exports = {
  getMockUsers,
  getMockCouriers,
  getMockDataset,
  seedMockDataset,
};
