const User = require("../models/user.model");
const Order = require("../models/order.model");
const Delivery = require("../models/delivery.model");

const saveMockDataset = async ({ users, orders, deliveries }) => {
  const savedUsers = await User.insertMany(users);
  const savedOrders = await Order.insertMany(orders);
  const savedDeliveries = await Delivery.insertMany(deliveries);

  return {
    users: savedUsers.length,
    orders: savedOrders.length,
    deliveries: savedDeliveries.length,
  };
};

module.exports = {
  saveMockDataset,
};
