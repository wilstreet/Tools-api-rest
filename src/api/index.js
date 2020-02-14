const { Router } = require('express');
const allies = require('./routes/customer');

module.exports = () => {
  const app = Router();
  allies(app);

  return app;
}