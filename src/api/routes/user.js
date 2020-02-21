const { Router } = require('express');
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  validateField,
} = require('../controllers/user');

const router = Router();

module.exports = app => {
  app.use('/users', router);

  router.route('/')
    .get(getUsers)

  router.route('/validate/:field')
    .post(validateField);

  router.route('/signup')
    .post(createUser);

  router.route('/signin')
    .post(loginUser);

  router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);
};
