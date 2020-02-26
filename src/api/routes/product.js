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

  router.all(validateAuthentication);

  router.route('/')
    .get(getProducts)
    .post(createProduct);

  router.route('/:id')
    .get(getProductById)
    .put(updateProduct)
    .delete(deleteProduct);
};
