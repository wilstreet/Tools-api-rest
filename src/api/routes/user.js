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
const validateAuthentication = require('../middlewares/authentication');

const router = Router();

module.exports = app => {
  app.use('/users', router);

  router.route('/')
    .get(validateAuthentication, getUsers);

  router.route('/validate/:field')
    .post(validateField);

  router.route('/signup')
    .post(createUser);

  router.route('/signin')
    .post(loginUser);

  router.route('/:id')
    .get(validateAuthentication, getUserById)
    .put(validateAuthentication, updateUser)
    .delete(validateAuthentication, deleteUser);
};
