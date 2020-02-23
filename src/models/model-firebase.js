const admin = require('firebase-admin');
const serviceAccount = require('../.././private/firebase-admin.json');
const { firebase } = require('../config');
const UsefulError = require('../utils/useful-error');

// Admin firebase initialize
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebase.databaseURL
});
// Firestore reference
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
  try {
    const doc = await db.collection(collection).doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  } catch(err) {
    console.log(err);
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
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
  } catch(err) {
    console.log(err);
    throw new UsefulError('The database not work!!');
  }
} 

async function getUserByEmailOrUsername(collection, emailOrUsername) {
  const snapshotByUsername = await getExistingField(collection, 'username', emailOrUsername);
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
