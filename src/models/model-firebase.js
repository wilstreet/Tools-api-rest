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

// CRUD
async function getAll(collection, where) {
  try {
    if (!where) {
      const response = await db.collection(collection).get();
      const parseData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return parseData;
    } else {
      const { field, value } = where;
      const response = await db.collection(collection)
        .where(field, '==', value)
        .get();
      const parseData = response.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return parseData;
    }
  } catch(err) {
    throw new UsefulError(err);
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
    throw new UsefulError(err);
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
    throw new UsefulError(err);
  }
}

async function updateElement(collection, id, data) {
  try {
    await db.collection(collection).doc(id).update({
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      ...data,
    });
  } catch(err) {
    throw new UsefulError(err);
  }
}

async function deleteElement(collection, id) {
  try {
    await db.collection(collection).doc(id).delete();
  } catch(err) {
    throw new UsefulError(err);
  }
}

// Others features
async function getExistingField(collection, field, value) {
  try {
    const snapshot = await db.collection(collection)
      .where(field, "==", value).get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))[0];
  } catch(err) {
    throw new UsefulError(err);
  }
} 

// User features
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

// Chat features
async function getIdConversation(idCustomer, idAlly) {
  try {
    const snapshot = await db.collection('messages')
      .where('idCustomer', '==', idCustomer)
      .where('idAlly', '==', idAlly)
      .get();
    if (snapshot.empty) {
      return null;
    }
    return snapshot.docs.map(doc => doc.id)[0];
  } catch(err) {
    throw new UsefulError(err);
  }
}

async function getAllMessages(idCustomer, idAlly) {
  try {
    const idConversation = await getIdConversation(idCustomer, idAlly);
    if (!idConversation) {
      return null;
    }
    const messages =  await db.collection('messages').doc(idConversation).get();
    if (messages.empty) {
      return [];
    }
    return { messages: messages.data().messages };
  } catch(err) {
    throw new UsefulError(err);
  }
}

async function addMessage(idCustomer, idAlly, messages) {
  const element = {
    idCustomer,
    idAlly,
    messages
  }
  try {
    const idConversation = await getIdConversation(idCustomer, idAlly);
    if (!idConversation) {
      await db.collection('messages').add(element);
    } else {
      await db.collection('messages').doc(idConversation).update({ messages });
    }
    return element;
  } catch(err) {
    throw new UsefulError(err);
  }
};

module.exports = {
  getAll,
  getElementById,
  createElement,
  updateElement,
  deleteElement,
  getUserByEmailOrUsername,
  getExistingField,
  getAllMessages,
  addMessage,
};
