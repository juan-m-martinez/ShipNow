const mockService = require("../services/mock.service");

const getMockUsers = (req, res, next) => {
  try {
    const users = mockService.getMockUsers(req.query.qty);
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

const getMockCouriers = (req, res, next) => {
  try {
    const couriers = mockService.getMockCouriers(req.query.qty);
    return res.status(200).json(couriers);
  } catch (error) {
    return next(error);
  }
};

const getMockDataset = (req, res, next) => {
  try {
    const dataset = mockService.getMockDataset(req.query.qty);
    return res.status(200).json(dataset);
  } catch (error) {
    return next(error);
  }
};

const seedMockDataset = async (req, res, next) => {
  try {
    const result = await mockService.seedMockDataset(req.query.qty);
    return res.status(201).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getMockUsers,
  getMockCouriers,
  getMockDataset,
  seedMockDataset,
};
