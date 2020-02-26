const argon2 = require('argon2');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../.././config');
const UsefulError = require('../.././utils/useful-error');
const {
  getAll,
  createElement,
  getElementById,
  updateElement,
  deleteElement,
  getExistingField,
} = require('../.././models/model-firebase');

const COLLECTION_NAME = 'users';

async function getUsers(req, res, next) {
  try {
    const users = await getAll(COLLECTION_NAME);
    return res.json(users);
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
  // Validate required fields
  if (!firstName || !lastName || !username || !email || !password || !role) {
    return next(new UsefulError('Incomplete form data', 400));
  }
  try {
    const newUser = await createElement(COLLECTION_NAME, {
      firstName,
      lastName,
      username,
      email,
      password: await argon2.hash(password),
      role,
      online: false,
    });
    return res.status(201).json(newUser);
  } catch (err) {
    return next(err);
  }
}

async function loginUser(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) {
      return next(new UsefulError('Username or password not correct', 403));
    } else {
      const token = jwt.sign({
        sub: user.id,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (600 * 600)
      }, jwtConfig.secretKey);
      return res.json({ token });
    }
  })(req, res);
}

async function getUserById(req, res, next) {
  try {
    const user = await getElementById(COLLECTION_NAME, req.params.id);
    if (!user) {
     return next(new UsefulError('The user not exist!!', 404));
    }
    return res.json(user);
  } catch (err) {
    return next(err);
  }
}

async function updateUser(req, res, next) {
  const updatedUser = {};
  // Validate the fields to update
  for (let prop in req.body) {
    if (prop === 'firstName' || prop === 'lastName' || prop === 'username' || prop === 'email') {
      updatedUser[prop] = req.body[prop];
    }
  }
  try {
    await updateElement(COLLECTION_NAME, req.params.id, updatedUser);
    return res.sendStatus(204);
  } catch(err) {
    return next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    await deleteElement(COLLECTION_NAME, req.params.id);
    return res.sendStatus(204);
  } catch(err) {
    return next(err);
  } 
}

async function validateField(req, res, next) {
  const { field } = req.body;
  if (!field) {
    return next(new UsefulError(`Incomplete field: ${req.params.field}`, 400));
  }
  try {
    const fieldValue = await getExistingField(COLLECTION_NAME, req.params.field, field);
    if (fieldValue) {
      return next(new UsefulError(`Field ${req.params.field} already exists`, 400));
    }
    return res.json({ message: 'The field does not exist you can use it' });
  } catch(err) {
    return next(err);
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
