const Delivery = require("../models/delivery.model");

const findAllDeliveries = async ({ skip, limit }) => {
  const [deliveries, total] = await Promise.all([
    Delivery.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Delivery.countDocuments({}),
  ]);
  return { deliveries, total };
};

const findDeliveryById = async (id) => Delivery.findById(id).lean();

const createDelivery = async (deliveryData) => Delivery.create(deliveryData);

const updateDelivery = async (id, changes) =>
  Delivery.findByIdAndUpdate(
    id,
    changes,
    { returnDocument: "after", runValidators: true },
  ).lean();

const deleteDelivery = async (id) => Delivery.findByIdAndDelete(id).lean();

const appendDeliveryProof = async (id, metadata) =>
  Delivery.findByIdAndUpdate(
    id,
    { $push: { proofs: metadata } },
    { returnDocument: "after", runValidators: true },
  ).lean();

module.exports = {
  findAllDeliveries,
  findDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  appendDeliveryProof,
};
