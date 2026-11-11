const Product = require("../models/product.model");
const { PRODUCT_STATUS } = require("../constants");

const findAvailableProducts = async () => {
  return Product.find({ status: PRODUCT_STATUS.AVAILABLE })
    .select("name description price stock status")
    .lean();
};

module.exports = {
  findAvailableProducts,
};
