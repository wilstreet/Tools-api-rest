const {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
} = require('../.././models/model-firebase');
const UsefulError = require('../.././utils/useful-error');

const COLLECTION_NAME = 'products';

async function getProducts(req, res, next) {
  const { idStore } = req.query;
  // Validate field with store id
  if (!idStore) {
    return next(new UsefulError('Store ID is required', 400));
  }
  try {
    // Filter products by store
    const products = await getAll(COLLECTION_NAME, { field: 'idStore', value: idStore });
    res.json(products);
  } catch(err) {
    return next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await getElementById(COLLECTION_NAME, req.params.id);
    if (!product) {
      return next(new UsefulError('The product not exist!!', 404));
    }
    res.json(product);
  } catch (err) {
    return next(err);
  }
}

async function createProduct(req, res, next) {
  const { idStore } = req.query;
  const { code, name, count, price } = req.body;
  // Validate field with store id
  if (!idStore) {
    return next(new UsefulError('Store ID is required', 400));
  }
  // Validate required fields
  if (!code || !name || !price) {
    return next(new UsefulError('Incomplete form data', 400));
  }
  try {
    const store = await getElementById('stores', idStore);
    // Validate store
    if (!store) {
      return next(new UsefulError('Store ID not exist!!', 400));
    }
    const newProduct = await createElement(COLLECTION_NAME, {
      idStore,
      code,
      name,
      count: count || 0,
      price
    });
    res.status(201).json(newProduct);
  } catch(err) {
    return next(err);
  }
}

async function updateProduct(req, res, next) {
  const updatedProduct = {};
  // Validate the fields to update
  for (let prop in req.body) {
    if (prop === 'code' || prop === 'name' || prop === 'count' || prop === 'price') {
      updatedProduct[prop] = req.body[prop];
    }
  }
  try {
    await updateElement(COLLECTION_NAME, req.params.id, updatedProduct);
    res.sendStatus(204);
  } catch(err) {
    return next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await deleteElement(COLLECTION_NAME, req.params.id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  } 
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
