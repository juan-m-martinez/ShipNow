const User = require("../models/user.model");
const Order = require("../models/order.model");
const Delivery = require("../models/delivery.model");
const AppError = require("../errors/app.error");

const saveMockDataset = async ({ users, orders, deliveries }) => {
  try {
    const savedUsers = await User.insertMany(users);
    const savedOrders = await Order.insertMany(orders);
    const savedDeliveries = await Delivery.insertMany(deliveries);

    return {
      users: savedUsers.length,
      orders: savedOrders.length,
      deliveries: savedDeliveries.length,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError("MOCK_PERSISTENCE_FAILED");
  }
};

module.exports = {
  saveMockDataset,
};