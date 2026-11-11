const mockService = require("../services/mock.service");

const MAX_MOCK_QTY = 100;

const getQty = (req, res) => {
  const qty = Number(req.query.qty);

  if (!Number.isInteger(qty) || qty < 1 || qty > MAX_MOCK_QTY) {
    res.status(400).json({
      error: `El parámetro qty debe ser un entero entre 1 y ${MAX_MOCK_QTY}.`,
    });
    return null;
  }

  return qty;
};

const getMockUsers = (req, res, next) => {
  const qty = getQty(req, res);
  if (qty === null) return;

  try {
    return res.status(200).json(mockService.getMockUsers(qty));
  } catch (error) {
    return next(error);
  }
};

const getMockCouriers = (req, res, next) => {
  const qty = getQty(req, res);
  if (qty === null) return;

  try {
    return res.status(200).json(mockService.getMockCouriers(qty));
  } catch (error) {
    return next(error);
  }
};

const getMockDataset = (req, res, next) => {
  const qty = getQty(req, res);
  if (qty === null) return;

  try {
    return res.status(200).json(mockService.getMockDataset(qty));
  } catch (error) {
    return next(error);
  }
};

const seedMockDataset = async (req, res, next) => {
  const qty = getQty(req, res);
  if (qty === null) return;

  try {
    const result = await mockService.seedMockDataset(qty);
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
