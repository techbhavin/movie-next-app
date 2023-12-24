import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBquLXrd_FMLRQNInXjc2RPruiyudcFTxY",
  authDomain: "movie-test-29a0f.firebaseapp.com",
  projectId: "movie-test-29a0f",
  storageBucket: "movie-test-29a0f.appspot.com",
  messagingSenderId: "195435343954",
  appId: "1:195435343954:web:271a4b921e025b91b16f8b",
};

const app = initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = firebase.firestore();
