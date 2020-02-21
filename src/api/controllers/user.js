const argon2 = require('argon2');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../../config');
const UsefulError = require('../../utils/useful-error');
const {
  getAll,
  createElement,
  getElementById,
  updateElement,
  deleteElement,
  getExistingField,
} = require('../../models/model-firebase');

async function getUsers(req, res, next) {
  try {
    const users = await getAll('users');
    res.json(users);
  } catch(err) {
    return next(err);
  }
}

async function createUser(req, res, next) {
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    role
  } = req.body;
  if (!firstName || !lastName || !username || !email || !password || !role) {
    next(new UsefulError('Incomplete form data', 400));
  }
  try {
    const newUser = await createElement('users', {
      firstName,
      lastName,
      username,
      email,
      password: await argon2.hash(password),
      role,
    });
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

async function loginUser(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      next(new UsefulError('Username or password not correct', 404));
    } else {
      const payload = {
        sub: user.id,
        exp: jwtConfig.expire,
        username: user.username
      };
      const token = jwt.sign(JSON.stringify(payload), jwtConfig.secretKey, { 
        algorithm: jwtConfig.algorithm
      });
      res.json({ token });
    }
  })(req, res);
}

async function getUserById(req, res, next) {
  try {
    const user = await getElementById('users', req.params.id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  const updatedUser = {};
  for (let prop in req.body) {
    if (prop === 'firstName' || prop === 'lastName' || prop === 'username' || prop === 'email') {
      updatedUser[prop] = req.body[prop];
    }
  }
  try {
    await updateElement('users', req.params.id, updatedUser);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await deleteElement('users', req.params.id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  } 
}

async function validateField(req, res, next) {
  const { field } = req.body;
  if (!field) {
    next(new UsefulError(`Incomplete field: ${req.params.field}`, 400));
  }
  try {
    const fieldValue = await getExistingField('users',req.params.field, field);
    if (fieldValue) {
      return next(new UsefulError(`Field ${req.params.field} already exists`, 400));
    }
    res.json({ message: 'The field does not exist you can use it' });
  } catch(err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  validateField
};
