const { Router } = require('express');


const router = Router();
const {getAlly,createAlly,getAllyById,updateAlly,deleteAlly} =require('../controllers/ally');

module.exports = app => {
    app.use('/allys', router);
  
    router.route('/')
      .get(getAlly)
      .post(createAlly);
    router.route('/:id')
      .get(getAllyById)
      .put(updateAlly)
      .delete(deleteAlly);
  };
