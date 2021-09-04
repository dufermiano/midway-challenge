const {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  removeDuplicates,
} = require('./products');
const { purchase, devolution } = require('./purchase');

module.exports = {
  getProducts,
  getProductsById,
  createProduct,
  updateProduct,
  removeDuplicates,
  purchase,
  devolution,
};
