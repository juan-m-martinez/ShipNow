const mongoose = require("mongoose");
const deliveryRepository = require("../repositories/delivery.repository");
const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/user.repository");
const AppError = require("../errors/app.error");
const logger = require("../config/logger.config");
const { DELIVERY_PROOF_TYPE, DELIVERY_STATUS, USER_ROLE } = require("../constants");
const { buildFileMetadata, removeUploadedFile } = require("./file-metadata.service");

const ensureDeliveryExists = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const delivery = await deliveryRepository.findDeliveryById(id);
  if (!delivery) throw new AppError("DELIVERY_NOT_FOUND");
  return delivery;
};

const getDeliveries = async () => deliveryRepository.findAllDeliveries();

const getDeliveryById = async (id) => ensureDeliveryExists(id);

const validateCourier = async (courier) => {
  if (courier === null || courier === undefined) return courier;
  if (typeof courier !== "string" || !mongoose.isValidObjectId(courier)) {
    throw new AppError("INVALID_DATA");
  }
  const user = await userRepository.findUserById(courier);
  if (!user) throw new AppError("USER_NOT_FOUND");
  if (user.role !== USER_ROLE.COURIER) throw new AppError("INVALID_DATA");
  return courier;
};

const createDelivery = async (input = {}) => {
  const { order, courier, status } = input;
  if (typeof order !== "string" || !mongoose.isValidObjectId(order)) {
    throw new AppError("INVALID_DATA");
  }
  if (!(await orderRepository.findOrderById(order))) {
    throw new AppError("ORDER_NOT_FOUND");
  }
  if (status !== undefined && !Object.values(DELIVERY_STATUS).includes(status)) {
    throw new AppError("INVALID_DELIVERY_STATUS");
  }
  const deliveryData = { order };
  if (courier !== undefined) deliveryData.courier = await validateCourier(courier);
  if (status !== undefined) deliveryData.status = status;
  return deliveryRepository.createDelivery(deliveryData);
};

const updateDelivery = async (id, input = {}) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const fields = Object.keys(input);
  if (
    fields.length === 0 ||
    fields.some((field) => !["courier", "status"].includes(field))
  ) {
    throw new AppError("INVALID_DATA");
  }

  const changes = {};
  if (input.courier !== undefined) {
    changes.courier = await validateCourier(input.courier);
  }
  if (input.status !== undefined) {
    if (!Object.values(DELIVERY_STATUS).includes(input.status)) {
      throw new AppError("INVALID_DELIVERY_STATUS");
    }
    changes.status = input.status;
  }

  const delivery = await deliveryRepository.updateDelivery(id, changes);
  if (!delivery) throw new AppError("DELIVERY_NOT_FOUND");
  return delivery;
};

const deleteDelivery = async (id) => {
  if (!mongoose.isValidObjectId(id)) throw new AppError("INVALID_DATA");
  const delivery = await deliveryRepository.deleteDelivery(id);
  if (!delivery) throw new AppError("DELIVERY_NOT_FOUND");
  return delivery;
};

const addDeliveryProof = async (id, file) => {
  if (!file) throw new AppError("FILE_REQUIRED");

  try {
    await ensureDeliveryExists(id);
    const proof = buildFileMetadata(file, DELIVERY_PROOF_TYPE.RECEIPT);
    const delivery = await deliveryRepository.appendDeliveryProof(id, proof);
    if (!delivery) throw new AppError("DELIVERY_NOT_FOUND");
    logger.info(`Comprobante ${file.filename} asociado a la entrega ${id}`);
    return delivery;
  } catch (error) {
    await removeUploadedFile(file);
    if (error instanceof AppError) throw error;
    logger.error(`Error al asociar comprobante a la entrega ${id}: ${error.message}`);
    throw new AppError("FILE_SAVE_FAILED");
  }
};

module.exports = {
  getDeliveries,
  getDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  ensureDeliveryExists,
  addDeliveryProof,
};
