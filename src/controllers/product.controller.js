const productService = require("../services/product.service");

const getAvailableProducts = async (req, res, next) => {
  try {
    const products = await productService.getAvailableProducts();
    return res.status(200).json({ products });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAvailableProducts,
};
