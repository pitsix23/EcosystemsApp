// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBC3BNQwrxfK5cJ-rLFXFwCleyFZxidInE",
  authDomain: "dbecosystems-77997.firebaseapp.com",
  projectId: "dbecosystems-77997",
  storageBucket: "dbecosystems-77997.appspot.com",
  messagingSenderId: "212545019139",
  appId: "1:212545019139:web:25228f01438fa884bddd36",
  measurementId: "G-KWVG4NPHTQ"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

isSupported().then(supported => {
  if (supported) {
    const analytics = getAnalytics(app);
  } else {
    console.log("Analytics not supported in this environment.");
  }
});

export { app, firebaseConfig, storage,database};