const {
  getAll,
  createElement,
  getElementById,
  updateElement,
  deleteElement,
} = require('../../models/model-firebase');

function getCustomers(req, res) {
  getAll('customers')
    .then(customers => res.json(customers))
    .catch(err => {
      console.error(err.stack)
      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
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
    .catch(err => {
      console.error(err.stack)
      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

function getCustomerById(req, res) {
  getElementById('customers', req.params.id)
    .then(customer => {
      if (!customer) {
        res.status(404).json({
          error: {
            code: 404,
            message: `Customer with id: ${req.params.id} not exist`
          }
        });
        return;
      }
      res.json(customer);
    })
    .catch(err => {
      console.error(err.stack)
      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

function updateCustomer(req, res) {
  const updatedCustomer = {};
  for (let prop in req.body) {
    if (prop === 'firstName' || prop === 'lastName' || prop === 'username' || prop === 'email') {
      updatedCustomer[prop] = req.body[prop];
    }
  }
  updateElement('customers', req.params.id, updatedCustomer)
    .then(isExist => {
      if (!isExist) {
        res.status(404).json({
          error: {
            code: 404,
            message: `Customer with id: ${req.params.id} not exist`
          }
        });
        return;
      }
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err.stack)
      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

function deleteCustomer(req, res) {
  deleteElement('customers', req.params.id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(err => {
      console.error(err.stack)
      res.status(500).json({
        error: {
          code: 500,
          message: 'Internal server error'
        }
      });
    });
}

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
}