const { Router } = require('express');
const stores = require('./routes/store');
const products = require('./routes/product');
const customers = require('./routes/customer')


module.exports = () => {
  const app = Router();
  stores(app);
  products(app);
  customers(app);
  return app;
}
