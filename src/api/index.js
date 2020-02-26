const { Router } = require('express');
const users = require('./routes/user');
const stores = require('./routes/store');
const products = require('./routes/product');

module.exports = () => {
  const app = Router();
  users(app);
  stores(app);
  products(app);
  
  return app;
}