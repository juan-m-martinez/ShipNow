const mockFactory = require("./mock-data.factory");
const mockRepository = require("../repositories/mock.repository");
const AppError = require("../errors/app.error");
const { USER_ROLE } = require("../constants");
const logger = require("../config/logger.config");

const MAX_MOCK_QTY = 100;

const validateQty = (qty) => {
  const isSupportedType = typeof qty === "string" || typeof qty === "number";
  const isBlank = typeof qty === "string" && qty.trim() === "";
  const parsedQty = Number(qty);

  if (
    !isSupportedType ||
    isBlank ||
    !Number.isInteger(parsedQty) ||
    parsedQty < 1 ||
    parsedQty > MAX_MOCK_QTY
  ) {
    logger.warning(`Cantidad de mocks inválida recibida: ${qty}`);
    throw new AppError("INVALID_MOCK_QTY");
  }

  return parsedQty;
};

const getMockUsers = (qty) => {
  const validatedQty = validateQty(qty);
  const users = mockFactory.generateMockUsers(validatedQty, USER_ROLE.USER);

  logger.info(`Mocks generados: ${validatedQty} usuarios`);
  return users;
};

const getMockCouriers = (qty) => {
  const validatedQty = validateQty(qty);
  const couriers = mockFactory.generateMockUsers(
    validatedQty,
    USER_ROLE.COURIER,
  );

  logger.info(`Mocks generados: ${validatedQty} repartidores`);
  return couriers;
};

const createMockDataset = (qty) => {
  const validatedQty = validateQty(qty);

  try {
    const users = mockFactory.generateMockUsers(validatedQty, USER_ROLE.USER);
    const couriers = mockFactory.generateMockUsers(
      validatedQty,
      USER_ROLE.COURIER,
    );
    const orders = mockFactory.generateMockOrders(validatedQty, users);
    const deliveries = mockFactory.generateMockDeliveries(orders, couriers);

    logger.info(
      `Conjunto de mocks generado: ${validatedQty} registros por tipo`,
    );

    return { users, couriers, orders, deliveries };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("MOCK_GENERATION_FAILED");
  }
};

const getMockDataset = (qty) => createMockDataset(qty);

const seedMockDataset = async (qty) => {
  const dataset = createMockDataset(qty);

  const saved = await mockRepository.saveMockDataset({
    users: [...dataset.users, ...dataset.couriers],
    orders: dataset.orders,
    deliveries: dataset.deliveries,
  });

  logger.info(
    `Mocks guardados en MongoDB: ${dataset.users.length} usuarios, ` +
      `${dataset.couriers.length} repartidores, ${saved.orders} pedidos y ` +
      `${saved.deliveries} entregas`,
  );

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
