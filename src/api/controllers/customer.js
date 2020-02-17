const {
  getAll,
  createElement,
  getElementById,
  updateElement,
  deleteElement,
} = require('../../models/model-firebase');

async function getCustomers(req, res, next) {
  try {
    const customers = await getAll('customers');
    res.json(customers);
  } catch(err) {
    return next(err);
  }
}

async function createCustomer(req, res, next) {
  const {
    firstName,
    lastName,
    username,
    email,
  } = req.body;
  try {
    const newCustomer = await createElement('customers', {
      firstName,
      lastName,
      username,
      email,
    });
    res.status(201).json(newCustomer);
  } catch (err) {
    next(err);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const customer = await getElementById('customers', req.params.id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
}

async function updateCustomer(req, res, next) {
  const updatedCustomer = {};
  for (let prop in req.body) {
    if (prop === 'firstName' || prop === 'lastName' || prop === 'username' || prop === 'email') {
      updatedCustomer[prop] = req.body[prop];
    }
  }
  try {
    await updateElement('customers', req.params.id, updatedCustomer);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    await deleteElement('customers', req.params.id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  } 
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}