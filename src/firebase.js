// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBwz8GOvQqk4Jbgc1nXSxQ7JS2uzIpl0M",
  authDomain: "petcare-6e62a.firebaseapp.com",
  projectId: "petcare-6e62a",
  storageBucket: "petcare-6e62a.firebasestorage.app",
  messagingSenderId: "917626620022",
  appId: "1:917626620022:web:3f1be8dc4caa2973e63757",
  measurementId: "G-YCZSRE8GTV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };