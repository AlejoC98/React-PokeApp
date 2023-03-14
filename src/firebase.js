// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDptB9aKgwOvz1M4h0n3JJGwIhgdCZsAzg",
  authDomain: "react-pokeapp.firebaseapp.com",
  projectId: "react-pokeapp",
  storageBucket: "react-pokeapp.appspot.com",
  messagingSenderId: "77477969110",
  appId: "1:77477969110:web:50a640cc5b0ca87bbe9d77"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Initialize firebase storage
const storage = getStorage(app);

const auth = getAuth(app);

export { auth, db, storage }