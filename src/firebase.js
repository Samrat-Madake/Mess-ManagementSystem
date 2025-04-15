// Import the functions you need from the SDKs you need
//import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDfUMYkpSrpAGQdI7JYgg-flJYnArwGESs",
  authDomain: "mess-management-8aa4c.firebaseapp.com",
  projectId: "mess-management-8aa4c",
  storageBucket: "mess-management-8aa4c.firebasestorage.app",
  messagingSenderId: "651484771720",
  appId: "1:651484771720:web:23266e7e57fcf1016e363d"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };









