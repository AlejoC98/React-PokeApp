import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithPopup
} from 'firebase/auth';

import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';

import { collection, addDoc, where, getDocs, query } from "firebase/firestore";

import { auth, storage, db } from "../firebase";

import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { queryCollection } from "./FirebaseContext";

export const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  // Create user with email and password function
  const createUser = async (firstname, lastname, email, password, img_profile) => {
    return createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const user = userCredential.user;
      // Send Verification email
      verifiedUserEmail(user);
      // create new user data
      await CreateNewUserData(user, firstname, lastname, email, img_profile);
      // Return Status
      return 'Please check your inbox to verify your email';
    }).catch((err) => {
      throw new Error(err);
    });
  }

  // Login in with email and password
  const signIn = async (email, password) => {
    const authCont = await signInWithEmailAndPassword(auth, email, password);
    if (authCont.user.emailVerified === false) {
      setUser(null);
      throw new Error("Email hasn't been verified");
    }
  }

  // Log Out function
  const logOut = () => {
    console.log(auth);
    return signOut(auth);
  }

  // function to check if user was or is logged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      queryCollection('users', [
        {field: 'email', operator: '==', value: currentUser.email}
      ]).then((res) => {
        currentUser['id'] = res.id;
        currentUser !== null ? currentUser.emailVerified === true ? setUser(currentUser) : setUser(null) : setUser(currentUser);
      });
    });

    return () => {
      unsubscribe();
    }

  }, []);

  // Function to send a recovery password email
  const recoveryPassword = async (email) => {
    await sendPasswordResetEmail(auth, email).then(() => {
      return true;
    })
      .catch((err) => {
        throw new Error(err);
      });
  }

  // Function to send a verification email before user can access
  const verifiedUserEmail = async(currentUser) => {
    await sendEmailVerification(currentUser).then(() => {
      console.log('Plase check your email');
    }).catch((err) => {
      console.log(err);
    });
  }

  const CreateNewUserData = async (user, firstname, lastname, email, img_profile) => {
    let upload_img;
    const user_id = Array.from({length: 20}, () => Math.random().toString(36)[2] || Math.floor(Math.random() * 20)).join('');

    const q = query(collection(db, 'users'), where('email', '==', email));

    const querySnapshot = await getDocs(q);

    if (!!img_profile) {
      if (typeof img_profile !== 'string') {
        const metadata = {
          contentType: 'image/jpeg'
        }

        var uniqueImgName = [firstname, lastname].join("_") + user_id;
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'users_profiles/' + uniqueImgName);
        // const uploadTask = await uploadBytesResumable(storageRef, img_profile.buffer, metadata);
        const uploadTask = await uploadBytesResumable(storageRef, img_profile, metadata);

        upload_img = await getDownloadURL(uploadTask.ref);
      } else {
        upload_img = img_profile;
      }
    } else {
      upload_img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngall.com%2Fprofile-png%2Fdownload%2F51525&psig=AOvVaw2Cy-FavCzDKct1N41XorEC&ust=1676560375535000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLiomZ_ol_0CFQAAAAAdAAAAABAE";
    }

    if (querySnapshot.docs.length === 0) {      
      await addDoc(collection(db, "users"), {
        id: user_id,
        email: email,
        firstname: firstname,
        lastname: lastname,
        profile: upload_img
      });
    }

    await updateProfile(user, {
      displayName: [firstname, lastname].join(" "),
      photoURL: upload_img
    }).catch((err) => {
      throw new Error(err);
    });
  }

  // function to login using other providers with a popup page
  const popUpProviderLogin = (option) => {
    let provider;
    switch (option) {
      case "google":
        provider = new GoogleAuthProvider();
        break;
      case "meta":
        provider = new FacebookAuthProvider();
        break;
      default:
        throw new Error('Option not valid');
    }

    signInWithPopup(auth, provider).then( async(result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      let credential;
      switch (option) {
        case "google":
          credential = GoogleAuthProvider.credentialFromResult(result);
          break;
        case "meta":
          credential = FacebookAuthProvider.credentialFromResult(result);
          break;
        default:
          throw new Error('Option not valid');
      }

      console.log(credential);
      // const token = credential.accessToken;

      await CreateNewUserData(result.user, result.user.displayName.split(" ")[0], result.user.displayName.split(" ")[1], result.user.email, result.user.photoURL);

      // The signed-in user info.
      setUser(result.user);
    }).catch((error) => {
      let credential;
      switch (option) {
        case "google":
          credential = GoogleAuthProvider.credentialFromError(error);
          break;
        case "meta":
          credential = FacebookAuthProvider.credentialFromError(error);
          break;
        default:
          throw new Error('Option not valid');
      }

      console.log(credential);

      throw new Error(error.message);
    });
  }

  return (
    <UserContext.Provider value={{ createUser, user, logOut, signIn, recoveryPassword, popUpProviderLogin }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
}