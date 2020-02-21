const admin = require('firebase-admin');
const serviceAccount = require('../.././private/firebase-admin.json');
const { firebase } = require('../config');
const UsefulError = require('../utils/useful-error');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebase.databaseURL
});

const db = admin.firestore();

async function getAll(collection) {
  try {
    const response = await db.collection(collection).get();
    const parseData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return parseData;
  } catch(err) {
    console.log(err);
    throw new UsefulError('The database not work!!');
  }
};

async function getElementById(collection, id) {
  let validateElement = true;
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      validateElement = doc.exists;
      throw new Error;
    }
    return doc.data();
  } catch(err) {
    console.log(err);
    if (!validateElement) {
      throw new UsefulError('The element not exist!!', 404);
    }
    throw new UsefulError('The database not work!!', 500);
  }
}

async function createElement(collection, data) {
  const element = {
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    ...data,
  }
  try {
    await db.collection(collection).add(element);
    return element;
  } catch(err) {
    console.log(err);
    throw new UsefulError('The database not work!!');
  }
}

async function updateElement(collection, id, data) {
  try {
    await db.collection(collection).doc(id).update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
  } catch(err) {
    console.log(err);
    throw new UsefulError('The database not work!!');
  }
}

async function deleteElement(collection, id) {
  try {
    await db.collection(collection).doc(id).delete();
  } catch(err) {
    console.log(err);
    throw new UsefulError('The database not work!!');
  }
}

async function getExistingField(collection, field, value) {
  try {
    const snapshot = await db.collection(collection)
      .where(field, "==", value).get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs.map(doc => doc.data())[0];
  } catch(err) {
    console.log(err);
    throw new UsefulError('The database not work!!');
  }
} 

async function getUserByEmailOrUsername(collection, emailOrUsername) {
  const snapshotByUsername = await getExistingField(collection, 'username', emailOrUsername);
  console.log('debug', snapshotByUsername)
  if (snapshotByUsername) {
    return snapshotByUsername;
  }
  const snapshotByEmail = await getExistingField(collection, 'email', emailOrUsername);
  if (snapshotByEmail) {
    return snapshotByEmail;
  }
  return null;
}

module.exports = {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
  getUserByEmailOrUsername,
  getExistingField,
};
