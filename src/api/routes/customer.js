const { Router } = require('express');
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customer');
const router = Router();

module.exports = app => {
  app.use('/customers', router);
   
  router.route('/')
    .get(getCustomers)
    .post(createCustomer);

  router.route('/:id')
    .get(getCustomerById)
    .put(updateCustomer)
    .delete(deleteCustomer);
};
