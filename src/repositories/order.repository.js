const Order = require("../models/order.model");

const findAllOrders = async () => Order.find({}).sort({ createdAt: -1 }).lean();

const findOrderById = async (id) => Order.findById(id).lean();

const createOrder = async (orderData) => Order.create(orderData);

const updateOrder = async (id, changes) =>
  Order.findByIdAndUpdate(id, changes, { returnDocument: "after", runValidators: true }).lean();

const deleteOrder = async (id) => Order.findByIdAndDelete(id).lean();

const updateOrderStatus = async (id, status) =>
  Order.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true },
  ).lean();

module.exports = {
  findAllOrders,
  findOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
};
