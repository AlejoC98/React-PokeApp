import { createContext } from "react";
import { 
  createUserWithEmailAndPassword, 
  singInWithEmailAndPassword, 
  signOut, 
  onAuthStateChange 
} from 'firebase/auth'
import { auth } from "../firebase";

const authLogin = async (email, password) => {
  return singInWithEmailAndPassword(auth, email, password).then((userCredential) => {
    return userCredential.user;
  }).catch((err) => {
    throw new Error(err.code);
  });
}

const createUser = async (firstname, lastname, email, password, img) => {
  console.log(firstname);
}