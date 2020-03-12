const { Router } = require('express');


const router = Router();
const {getCustomers,createCustomer,getCustomerById,updateCustomer,deleteCustomer} =require('../controllers/customer');

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
