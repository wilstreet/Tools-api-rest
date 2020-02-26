const {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
} = require('../.././models/model-firebase');
const UsefulError = require('../.././utils/useful-error');

const COLLECTION_NAME = 'stores';

async function getStores(req, res, next) {
  const { idAlly } = req.query;
  try {
    // Get all the stores
    if (!idAlly) {
      const stores = await getAll(COLLECTION_NAME);
      res.json(stores);
    }
    // Validate user
    const user = await getElementById('users', idAlly);
    if (!user) {
      return next(new UsefulError('Ally ID not exist!!', 400));
    }
    // Filter stores by ally
    const stores = await getAll(COLLECTION_NAME, { field: 'idAlly', value: idAlly });
    res.json(stores);
  } catch(err) {
    return next(err);
  }
}

async function getStoreById(req, res, next) {
  try {
    const store = await getElementById(COLLECTION_NAME, req.params.id);
    if (!store) {
      return next(new UsefulError('The store not exist!!', 404));
    }
    res.json(store);
  } catch (err) {
    return next(err);
  }
}

async function createStore(req, res, next) {
  const { idAlly } = req.query;
  const { name, location } = req.body;
  // Validate field with ally id
  if (!idAlly) {
    return next(new UsefulError('Ally ID is required', 400));
  }
  // Validate required fields
  if (!name || !location) {
    return next(new UsefulError('Incomplete form data', 400));
  }
  try {
    // Validate user
    const user = await getElementById('users', idAlly);
    if (!user) {
      return next(new UsefulError('Ally ID not exist!!', 400));
    }
    const newStore = await createElement(COLLECTION_NAME, {
      idAlly,
      name,
      location
    });
    res.status(201).json(newStore);
  } catch(err) {
    return next(err);
  }
}

async function updateStore(req, res, next) {
  const updatedStore = {};
  // Validate the fields to update
  for (let prop in req.body) {
    if (prop === 'name' || prop === 'location') {
      updatedStore[prop] = req.body[prop];
    }
  }
  try {
    await updateElement(COLLECTION_NAME, req.params.id, updatedStore);
    res.sendStatus(204);
  } catch(err) {
    return next(err);
  }
}

async function deleteStore(req, res, next) {
  try {
    await deleteElement(COLLECTION_NAME, req.params.id);
    res.sendStatus(204);
  } catch(err) {
    return next(err);
  } 
}

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
};
