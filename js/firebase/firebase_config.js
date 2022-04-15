//This file will be injected before body tag.
//Add file to src or modify path accordingly in manifest.json

import { initializeApp } from "./firebase-app.js";
import { getFirestore, collection, query, where, getDocs, addDoc, getDoc, doc } from "./firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDeqFA2YQIZnUjVVTxiGajIrVEWQ2_D8cw",
  authDomain: "sourcemaker-6cd67.firebaseapp.com",
  projectId: "sourcemaker-6cd67",
  storageBucket: "sourcemaker-6cd67.appspot.com",
  messagingSenderId: "666583063353",
  appId: "1:666583063353:web:fcecc3009cb6c41fb126e8",
};

const firebase_app = initializeApp(firebaseConfig);

console.log(firebase_app);

const db = getFirestore(firebase_app);

let test = doc(db, "reports", "test");
const docu = await getDoc(test);
console.log(docu.data());

export { db };

/* async function get_database_elements(db_name) {
  const q = query(collection(db, db_name));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
} */

/* //In order to use firebase_app and db inside the injected website
//pass to global scope is needed, because in module it has local scope
globalThis.firebase_app = firebase_app;
globalThis.db = db;
globalThis.get_database_elements = get_database_elements; */
