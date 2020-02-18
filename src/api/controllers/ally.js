const {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
} = require('../../models/model-firebase');

async function getAllies(req, res, next) {
  try {
    const allies = await getAll('allies');
    res.json(allies);
  } catch(err) {
    next(err);
  }
}

async function createAlly(req, res, next) {
  const {
    firstName
  } = req.body;
  try {
    const newAlly = await createElement('allies', {
      firstName
    });
    res.status(201).json(newAlly);
  } catch(err) {
    next(err);
  }
}

async function getAllyById(req, res, next) {
  try {
    const ally = await getElementById('allies', req.params.id);
    res.json(ally);
  } catch(err) {
    next(err);
  }
}

async function updateAlly(req, res, next) {
  const updatedAlly = {};
  for (let prop in req.body) {
    if (prop === 'firstName') {
      updatedAlly[prop] = req.body[prop];
    }
  }
  try {
    await updateElement('allies', req.params.id, updatedAlly);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}

async function deleteAlly(req, res, next) {
  try {
    await deleteElement('allies', req.params.id);
    res.sendStatus(204);
  } catch(err) {
    next(err);
  }
}

module.exports = {
  getAllies,
  getAllyById,
  createAlly,
  updateAlly,
  deleteAlly,
}