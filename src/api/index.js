const { Router } = require('express');
const stores = require('./routes/store');
const products = require('./routes/product');
const users = require('./routes/user');

module.exports = () => {
  const app = Router();
  users(app);
  stores(app);
  products(app);
  
  return app;
}