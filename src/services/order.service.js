const mongoose = require("mongoose");
const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/user.repository");
const AppError = require("../errors/app.error");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../constants");

const getOrders = async () => orderRepository.findAllOrders();

const getOrderById = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const order = await orderRepository.findOrderById(id);
  if (!order) throw new AppError("ORDER_NOT_FOUND");
  return order;
};

const createOrder = async ({ user, destination, priority }) => {
  if (
    typeof user !== "string" ||
    !mongoose.isValidObjectId(user) ||
    typeof destination !== "string" ||
    !destination.trim() ||
    (priority !== undefined && !Object.values(ORDER_PRIORITY).includes(priority))
  ) {
    throw new AppError("INVALID_DATA");
  }

  const existingUser = await userRepository.findUserById(user);
  if (!existingUser) throw new AppError("USER_NOT_FOUND");

  return orderRepository.createOrder({
    user,
    destination: destination.trim(),
    ...(priority ? { priority } : {}),
  });
};

const updateOrderStatus = async (id, status) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  if (!Object.values(ORDER_STATUS).includes(status)) {
    throw new AppError("INVALID_ORDER_STATUS");
  }

  const order = await orderRepository.updateOrderStatus(id, status);
  if (!order) throw new AppError("ORDER_NOT_FOUND");
  return order;
};

module.exports = { getOrders, getOrderById, createOrder, updateOrderStatus };
