const { Router } = require('express');
const router = Router();
const {
  createUser,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user');

module.exports = app => {
  app.use('/users', router);

  router.route('/users/:id')
  .get(getUserById)
  .put(updateUser)
  .delete(deleteUser);

  router.route('/signup')
    .post(createUser);
}
