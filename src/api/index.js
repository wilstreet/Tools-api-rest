const { Router } = require('express');
const stores = require('./routes/store');
const products = require('./routes/product');
const customers = require('./routes/customer');
const allies = require('./routes/ally');


module.exports = () => {
  const app = Router();
  stores(app);
  products(app);
  customers(app);
  allies(app);
  return app;
}
