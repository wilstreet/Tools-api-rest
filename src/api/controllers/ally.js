const {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement
} = require('../../models/model-firebase');

async function getAllies(req, res, next) {
  try {
    const allies = await getAll('allies');
    res.json(allies);
  } catch(err) {
    next(err);
  }
}

function getAllyById(req, res, next) {
  
}

function createAlly(req, res, next) {

}

function updateAlly(req, res, next) {

}

function deleteAlly(req, res, next) {

}

module.exports = {
  getAllies,
  getAllyById,
  createAlly,
  updateAlly,
  deleteAlly,
}