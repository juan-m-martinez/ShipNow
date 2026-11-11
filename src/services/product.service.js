const productRepository = require("../repositories/product.repository");

const getAvailableProducts = async () => {
  const products = await productRepository.findAvailableProducts();

  return products.filter((product) => product.stock > 0);
};

module.exports = {
  getAvailableProducts,
};
