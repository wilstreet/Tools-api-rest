const { Router } = require('express');
const users = require('./routes/user');

module.exports = () => {
  const app = Router();
  users(app);
  
  return app;
}