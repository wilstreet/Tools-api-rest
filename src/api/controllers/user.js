const argon2 = require('argon2');
const path = require('path');
const { getAuth, getDB } = require(path.resolve('src/services/admin-firebase'));
const { updateElement, deleteElement } = require(path.resolve('src/models/model-firebase'));
const UsefulError = require(path.resolve('src/utils/useful-error'));

const MIN_LENGTH_PASSWORD = 6;

// Get name of collection according to role
function collectionName(role) {
  switch (role) {
    case 'customer':
      return 'customers';
    case 'ally':
      return 'allies';
    default:
      return null;
  }
}

async function createUser(req, res, next) {
  const { 
    firstName,
    lastName,
    email,
    password,
    role,
  } = req.body;
  try {
    // Validate required fields
    if (!email || !firstName || !lastName || !password || !role) {
      return next(new UsefulError('The form is incomplete', 422));
    }
    // Validate minimum length password
    if (password.length < MIN_LENGTH_PASSWORD) {
      return next(new UsefulError('The password must be a string with at least 6 characters.', 422));
    }
    // Verify valid role
    const collection = collectionName(role);
    if (!collection) 
      return next(new UsefulError('Invalid role (customer or ally)', 422));
    // Create user firebase authentication
    const { uid } = await getAuth().createUser({
      email,
      password: await argon2.hash(password),
      displayName: `${firstName} ${lastName}`,
    });
    const user = {
      displayName: `${firstName} ${lastName}`,
      email,
      role,
      online: false,
      createdAt: new Date().toString(),
    };
    // Create document according to role
    await getDB().collection(collection).doc(uid).set(user);
    return res.status(201).json(user);
  } catch(err) {
    // Error email already exists
    if (err.code === 'auth/email-already-exists') {
      return next(new UsefulError(err.message, 409));
    }
    // Others errors
    return next(new UsefulError(err.message));
  }
}

async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const user = await getAuth().getUser(id);
    res.json(user);
  } catch(err) {
    // Error user not found
    if (err.code === 'auth/user-not-found') {
      return next(new UsefulError(err.message, 404));
    }
    // Others errors
    return next(new UsefulError(err.message));
  }
}

async function updateUser(req, res, next) {
  const { email, firstName, lastName, role } = req.body;
  const { id } = req.params;
  // The role is required to update
  if (!role)
    return next(new UsefulError('The role is required (customer or ally)', 422));  
  // Verify valid role
  const collection = collectionName(role);
  if (!collection) 
    return next(new UsefulError('Invalid role (customer or ally)', 422));
  // Validate required fields
  if (!email || !firstName || !lastName) {
    return next(new UsefulError('The form is incomplete', 422));
  }
  try {
    // Update user firebase authentication
    await getAuth().updateUser(id, { email, displayName: `${firstName} ${lastName}` });
    // Update user according to role
    await updateElement(collection, id, { email, displayName: `${firstName} ${lastName}` });
    return res.sendStatus(204);
  } catch(err) {
    // Error user not found
    if (err.code === 'auth/user-not-found') {
      return next(new UsefulError(err.message, 404));
    }
    // Error invalid email
    if (err.code === 'auth/invalid-email') {
      return next(new UsefulError(err.message, 422));
    }
    // Error email already exists
    if (err.code === 'auth/email-already-exists') {
      return next(new UsefulError(err.message, 409));
    }
    // Others errors
    return next(new UsefulError(err.message));
  }
}

async function deleteUser(req, res, next) {
  const { role } = req.body;
  const { id } = req.params;
  try {
     // The role is required to update
    if (!role)
      return next(new UsefulError('The role is required (customer or ally)', 422));  
    // Verify valid role
    const collection = collectionName(role);
    if (!collection) 
      return next(new UsefulError('Invalid role (customer or ally)', 422));
    // Delete user firebase authentication
    await getAuth().deleteUser(id);
    // Delete user according to role
    await deleteElement(collection, id);
    return res.sendStatus(204);
  } catch(err) {
    // Error user not found
    if (err.code === 'auth/user-not-found') {
      return next(new UsefulError(err.message, 404));
    }
    // Others errors
    return next(new UsefulError(err.message));
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
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
