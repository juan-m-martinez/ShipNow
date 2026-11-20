const deliveryService = require("../services/delivery.service");

const getDeliveries = async (req, res, next) => {
  try {
    return res.status(200).json(await deliveryService.getDeliveries(req.query));
  } catch (error) {
    return next(error);
  }
};

const createDelivery = async (req, res, next) => {
  try {
    return res.status(201).json({ delivery: await deliveryService.createDelivery(req.body) });
  } catch (error) {
    return next(error);
  }
};

const getDeliveryById = async (req, res, next) => {
  try {
    return res.status(200).json({ delivery: await deliveryService.getDeliveryById(req.params.deliveryId) });
  } catch (error) {
    return next(error);
  }
};

const updateDelivery = async (req, res, next) => {
  try {
    return res.status(200).json({ delivery: await deliveryService.updateDelivery(req.params.deliveryId, req.body) });
  } catch (error) {
    return next(error);
  }
};

const deleteDelivery = async (req, res, next) => {
  try {
    const delivery = await deliveryService.deleteDelivery(req.params.deliveryId);
    return res.status(200).json({ message: "Entrega eliminada", delivery });
  } catch (error) {
    return next(error);
  }
};

const ensureDeliveryExists = async (req, res, next) => {
  try {
    await deliveryService.ensureDeliveryExists(req.params.deliveryId);
    return next();
  } catch (error) {
    return next(error);
  }
};

const uploadProof = async (req, res, next) => {
  try {
    const delivery = await deliveryService.addDeliveryProof(
      req.params.deliveryId,
      req.file,
    );
    return res.status(201).json({ delivery });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getDeliveries,
  createDelivery,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  ensureDeliveryExists,
  uploadProof,
};
