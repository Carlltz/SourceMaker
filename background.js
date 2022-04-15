// Import the functions you need from the SDKs you need

import { initializeApp } from "/node_modules/firebase/app/dist/app/index";
import { getFirestore } from "/node_modules/firebase/firestore/dist/firestore/index";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeqFA2YQIZnUjVVTxiGajIrVEWQ2_D8cw",
  authDomain: "sourcemaker-6cd67.firebaseapp.com",
  projectId: "sourcemaker-6cd67",
  storageBucket: "sourcemaker-6cd67.appspot.com",
  messagingSenderId: "666583063353",
  appId: "1:666583063353:web:fcecc3009cb6c41fb126e8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
