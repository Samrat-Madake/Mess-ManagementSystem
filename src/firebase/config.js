import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

export { db, auth }; 









