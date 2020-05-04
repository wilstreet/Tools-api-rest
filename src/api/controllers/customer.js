const{
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
}= require('../../models/model-firebase');
const COLLECTION_NAME = 'customers'

async function getCustomers(req, res, next) {
    try {
      const customers = await getAll(COLLECTION_NAME);
      return res.json(customers);
    } catch(err) {
      return next(err);
    }
  }
  
  async function getCustomerById(req, res, next) {
    try {
      const customer = await getElementById(COLLECTION_NAME, req.params.id);
      if (!customer) {
        return next(new UsefulError('The customer not exist!!', 404));
        
      }
      return res.json(customer);
    } catch (err) {
      return next(err);
    }
  }

  
  async function createCustomer(req, res, next) {
    const { firstName, lastName, email} = req.body;
   
    // Validate required fields
    if (!firstName || !lastName || !email) {
      return next(new UsefulError('Incomplete form data', 400));
    }
    try {    
      const newCustomer = await createElement(COLLECTION_NAME, {
        firstName,
        lastName,
        email,
        online : false,
      });
      return res.status(201).json(newCustomer);
    } catch(err) {
      return next(err);
    }
  }
  
  async function updateCustomer(req, res, next) {
    const updatedCustomer = {};
    // Validate the fields to update
    for (let prop in req.body) {
      if (prop === 'firstName' || prop === 'lastName' || prop === 'email') {
        updatedCustomer[prop] = req.body[prop];
      }
    }
    try {
      await updateElement(COLLECTION_NAME, req.params.id, updatedCustomer);
      return res.sendStatus(204);
    } catch(err) {
      return next(err);
    }
  }
  
  async function deleteCustomer(req, res, next) {
    try {
      await deleteElement(COLLECTION_NAME, req.params.id);
      return res.sendStatus(204);
    } catch(err) {
      next(err);
    } 
  }

  module.exports={
    getCustomerById,
    getCustomers,
    createCustomer,
    deleteCustomer,
    updateCustomer
  };


