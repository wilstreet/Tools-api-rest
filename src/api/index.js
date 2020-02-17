const { Router } = require('express');
const customers = require('./routes/customer');
const allies = require('./routes/ally');

module.exports = () => {
  const app = Router();
  customers(app);
  allies(app);

  return app;
}