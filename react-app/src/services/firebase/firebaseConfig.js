// src/firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
    apiKey: "AIzaSyA1isKvGVxXcLsK78VoH324XvcuJnUPz7A",
    authDomain: "wiliot-asset-tracking.firebaseapp.com",
    databaseURL: "https://wiliot-asset-tracking-default-rtdb.firebaseio.com",
    projectId: "wiliot-asset-tracking",
    storageBucket: "wiliot-asset-tracking.appspot.com",
    messagingSenderId: "549531966324",
    appId: "1:549531966324:web:d3e21c5290cdf6cf3daa21"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const database = firebase.database();
export {firebaseApp}; // Add this line to export firebaseApp
