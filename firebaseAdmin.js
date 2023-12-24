// firebaseAdmin.js
import admin from 'firebase-admin';

const serviceAccount = require('./movie-test-29a0f-firebase-adminsdk-zsqhs-7608f62c20.json');

if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://movie-test-29a0f-default-rtdb.firebaseio.com/", // Replace with your Firebase project URL
    });
}

export { admin };
