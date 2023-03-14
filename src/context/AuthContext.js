import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword, signOut, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail 
} from 'firebase/auth';

import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';

import { auth, storage } from "../firebase";

const UserContext = createContext();


export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const createUser = async (firstname, lastname, email, password, img_profile) => {
    return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const user = userCredential.user;
      let upload_img;

      firstname = firstname.charAt(0).toUpperCase() + firstname.slice(1);
      lastname = lastname.charAt(0).toUpperCase() + lastname.slice(1);

      if (!!img_profile) {
        const metadata = {
          contentType: 'image/jpeg'
        }

        var uniqueImgName = [firstname, lastname].join("_") + new Date();
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + uniqueImgName);
        // const uploadTask = await uploadBytesResumable(storageRef, img_profile.buffer, metadata);
        const uploadTask = await uploadBytesResumable(storageRef, img_profile, metadata);

        upload_img = await getDownloadURL(uploadTask.ref);

      } else {
        upload_img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngall.com%2Fprofile-png%2Fdownload%2F51525&psig=AOvVaw2Cy-FavCzDKct1N41XorEC&ust=1676560375535000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLiomZ_ol_0CFQAAAAAdAAAAABAE";
      }

      await updateProfile(user, {
        displayName: [firstname, lastname].join(" "),
        photoURL: upload_img
      }).catch((err) => {
        throw new Error(err);
      });

      return true;

    }).catch((err) => {
      throw new Error(err);
    });
  }

  const signIn = async(email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  }

  const logOut = () => {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    }

  }, []);

  const recoveryPassword = async(email) => {
    await sendPasswordResetEmail(auth, email).then((res) => {
      return true;
    })
    .catch((err) => {
      throw new Error(err);
    });
  }

  return (
    <UserContext.Provider value={{ createUser, user, logOut, signIn, recoveryPassword}}>
      { children }
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
}