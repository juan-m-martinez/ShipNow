const orderService = require("../services/order.service");

const getOrders = async (req, res, next) => {
  try {
    return res.status(200).json({ orders: await orderService.getOrders() });
  } catch (error) {
    return next(error);
  }
};

const createOrder = async (req, res, next) => {
  try {
    return res.status(201).json({ order: await orderService.createOrder(req.body) });
  } catch (error) {
    return next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    return res.status(200).json({ order: await orderService.getOrderById(req.params.orderId) });
  } catch (error) {
    return next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    return res.status(200).json({ order: await orderService.updateOrderStatus(req.params.orderId, req.body.status) });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getOrders, createOrder, getOrderById, updateOrderStatus };
