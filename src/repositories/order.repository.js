const Order = require("../models/order.model");

const findAllOrders = async ({ skip, limit }) => {
  const [orders, total] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Order.countDocuments({}),
  ]);
  return { orders, total };
};

const findOrderById = async (id) => Order.findById(id).lean();

const createOrder = async (orderData) => Order.create(orderData);

const updateOrder = async (id, changes) =>
  Order.findByIdAndUpdate(id, changes, { returnDocument: "after", runValidators: true }).lean();

const deleteOrder = async (id) => Order.findByIdAndDelete(id).lean();

const appendOrderProof = async (id, metadata) =>
  Order.findByIdAndUpdate(
    id,
    { $push: { proofs: metadata } },
    { returnDocument: "after", runValidators: true },
  ).lean();

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
  appendOrderProof,
  updateOrderStatus,
};
