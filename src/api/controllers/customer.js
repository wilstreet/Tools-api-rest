const {
  getAll,
  createElement,
  getElementById,
  updateElement,
  deleteElement
} = require('../../models/model-firebase');

function getCustomers(req, res) {
  getAll('customers')
    .then(customers => res.json(customers))
    .catch(err => console.log(err));
}

function createCustomer(req, res) {
  const {
    firstName,
    lastName,
    username,
    email,
  } = req.body;
  createElement('customers', {
    firstName,
    lastName,
    username,
    email,
  }).then(customer => res.status(201).json(customer))
    .catch(err => console.log(err));
}

function getCustomerById(req, res) {
  getElementById('customers', req.params.id)
    .then(customer => {
      if (!customer) {
        res.status(404).send('Customer not exist');
        return;
      }
      res.json(customer);
    })
    .catch(err => console.log(err));
}

function updateCustomer(req, res) {
  const updatedCustomer = {};
  for (let prop in req.body) {
    if (prop === 'firstName' || prop === 'lastName' || prop === 'username' || prop === 'email') {
      updatedCustomer[prop] = req.body[prop];
    }
  }
  updateElement('customers', req.params.id, updatedCustomer)
    .then(() => res.sendStatus(204))
    .catch(err => console.log(err));
}

function deleteCustomer(req, res) {
  deleteElement('customers', req.params.id)
    .then(() => res.sendStatus(204))
    .catch(err => console.log(err));
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}