const { Router } = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product');
const validateAuthentication = require('../middlewares/authentication');

const router = Router();

module.exports = app => {
  app.use('/products', router);

  router.route('/')
    .get(validateAuthentication, getProducts)
    .post(validateAuthentication, createProduct);

  router.route('/:id')
    .get(validateAuthentication, getProductById)
    .put(validateAuthentication, updateProduct)
    .delete(validateAuthentication, deleteProduct);
};
