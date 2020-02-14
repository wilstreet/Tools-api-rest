const admin = require('firebase-admin');
const serviceAccount = require('../../private/test-varios-d68c7-firebase-adminsdk-as8jd-67df4e00f6.json');
const { firebase } = require('../config');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebase.databaseURL
});

const db = admin.firestore();

function getAll(collection) {
  return new Promise((resolve, reject) => {
    db.collection(collection).get()
      .then(querySnapshot => {
        const parseData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        resolve(parseData);
      })
      .catch(err => reject(err));
  });
};

function getElementById(collection, id) {
  return new Promise((resolve, reject) => {
    db.collection(collection).doc(id).get()
      .then(doc => doc.exists ? resolve(doc.data()) : resolve(null))
      .catch(err => reject(err));
  });
}

function createElement(collection, data) {
  return new Promise((resolve, reject) => {
    db.collection(collection).add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    })
      .then(() => resolve(element))
      .catch(err => reject(err));
  });
}

function updateElement(collection, id, data) {
  return new Promise((resolve, reject) => {
    db.collection(collection).doc(id).update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    })
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

function deleteElement(collection, id) {
  return new Promise((resolve, reject) => {
    db.collection(collection).doc(id).delete()
      .then(() => resolve())
      .catch(err => reject(err));
  });
}

module.exports = {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
};
