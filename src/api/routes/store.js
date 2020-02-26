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

  router.all(validateAuthentication);

  router.route('/')
    .get(getStores)
    .post(createStore);

  router.route('/:id')
    .get(getStoreById)
    .put(updateStore)
    .delete(deleteStore);
};
