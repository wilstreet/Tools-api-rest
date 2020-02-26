const { Router } = require('express');
const {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
} = require('../controllers/store');
const validateAuthentication = require('../middlewares/authentication');

const router = Router();

module.exports = app => {
  app.use('/stores', router);

  router.route('/')
    .get(validateAuthentication, getStores)
    .post(validateAuthentication, createStore);

  router.route('/:id')
    .get(validateAuthentication, getStoreById)
    .put(validateAuthentication, updateStore)
    .delete(validateAuthentication, deleteStore);
};
