import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "Your Api Key ",
  authDomain: "Your authDomain ",
  projectId: "Your Project Id",
  storageBucket: "Your Storage Bucket",
  messagingSenderId: "Your deatils",
  appId: "Your appId"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth }; 









