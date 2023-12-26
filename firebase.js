import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_REACT_APP_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_REACT_APP_AUTH_DOMAIN,
  projectId: NEXT_PUBLIC_REACT_APP_PROJECT_ID,
  storageBucket: NEXT_PUBLIC_REACT_APP_STORAGE_BUCKET,
  messagingSenderId: NEXT_PUBLIC_REACT_APP_MESSAGING_SENDER_ID,
  appId: NEXT_PUBLIC_REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = getAuth(app);
export const db = firebase.firestore();
