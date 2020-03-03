const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve('private/firebase-admin.json'));
const { firebase } = require(path.resolve('src/config'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: firebase.databaseURL
});

let db;
let auth;

module.exports = {
  getDB: () => {
    if (!db) return admin.firestore();
    return db;
  },
  getAuth: () => {
    if (!auth) return admin.auth();
    return auth;
  } 
};
