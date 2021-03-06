const { Router } = require('express');
const { 
  getAllies,
  createAlly,
  getAllyById,
  updateAlly,
  deleteAlly
} =require('../controllers/ally');

const router = Router();

module.exports = app => {
    app.use('/allies', router);
  
    router.route('/')
      .get(getAllies)
      .post(createAlly);
    router.route('/:id')
      .get(getAllyById)
      .put(updateAlly)
      .delete(deleteAlly);
  };
