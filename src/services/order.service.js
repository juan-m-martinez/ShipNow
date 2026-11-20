const mongoose = require("mongoose");
const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/user.repository");
const AppError = require("../errors/app.error");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../constants");
const { parsePagination, buildPagination } = require("./pagination.service");
const logger = require("../config/logger.config");
const { ORDER_PROOF_TYPE } = require("../constants");
const { buildFileMetadata, removeUploadedFile } = require("./file-metadata.service");

const getOrders = async (query) => {
  const pagination = parsePagination(query);
  const { orders, total } = await orderRepository.findAllOrders(pagination);
  return { orders, pagination: buildPagination({ ...pagination, total }) };
};

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

const updateOrder = async (id, input = {}) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const allowedFields = ["user", "destination", "priority", "status"];
  const fields = Object.keys(input);
  if (fields.length === 0 || fields.some((field) => !allowedFields.includes(field))) {
    throw new AppError("INVALID_DATA");
  }

  const changes = {};
  if (input.user !== undefined) {
    if (typeof input.user !== "string" || !mongoose.isValidObjectId(input.user)) {
      throw new AppError("INVALID_DATA");
    }
    if (!(await userRepository.findUserById(input.user))) {
      throw new AppError("USER_NOT_FOUND");
    }
    changes.user = input.user;
  }
  if (input.destination !== undefined) {
    if (typeof input.destination !== "string" || !input.destination.trim()) {
      throw new AppError("INVALID_DATA");
    }
    changes.destination = input.destination.trim();
  }
  if (input.priority !== undefined) {
    if (!Object.values(ORDER_PRIORITY).includes(input.priority)) {
      throw new AppError("INVALID_DATA");
    }
    changes.priority = input.priority;
  }
  if (input.status !== undefined) {
    if (!Object.values(ORDER_STATUS).includes(input.status)) {
      throw new AppError("INVALID_ORDER_STATUS");
    }
    changes.status = input.status;
  }

  const order = await orderRepository.updateOrder(id, changes);
  if (!order) throw new AppError("ORDER_NOT_FOUND");
  return order;
};

const deleteOrder = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const order = await orderRepository.deleteOrder(id);
  if (!order) throw new AppError("ORDER_NOT_FOUND");
  return order;
};

const addOrderProof = async (id, file) => {
  if (!file) throw new AppError("FILE_REQUIRED");
  try {
    await getOrderById(id);
    const order = await orderRepository.appendOrderProof(
      id,
      buildFileMetadata(file, ORDER_PROOF_TYPE.RECEIPT),
    );
    if (!order) throw new AppError("ORDER_NOT_FOUND");
    logger.info(`Comprobante ${file.filename} asociado al pedido ${id}`);
    return order;
  } catch (error) {
    await removeUploadedFile(file);
    if (error instanceof AppError) throw error;
    logger.error(`Error al asociar comprobante al pedido ${id}: ${error.message}`);
    throw new AppError("FILE_SAVE_FAILED");
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  addOrderProof,
};
