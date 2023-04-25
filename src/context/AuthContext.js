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

import { collection, addDoc, where, getDocs, query } from "firebase/firestore";

import { auth, db } from "../firebase";

import { GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { queryCollection, uploadFiles } from "./FirebaseContext";

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
    await signInWithEmailAndPassword(auth, email, password).then(async(authCont) => {
      const user_record = await queryCollection('users', [
        {field: 'email', operator: '==', value: authCont.user.email}
      ]);
      authCont.user.record_id = user_record.record_id;
      setUser(authCont);
    });
  }

  // Log Out function
  const logOut = () => {
    console.log(auth);
    return signOut(auth);
  }

  // function to check if user was or is logged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
      if (currentUser !== null)
        await queryCollection('users', [
          {field: 'email', operator: '==', value: currentUser.email}
        ]).then((res) => {
          currentUser['id'] = res.id;
          // currentUser !== null ? currentUser.emailVerified === true ? setUser(currentUser) : setUser(null) : setUser(currentUser);
        });
      
      setUser(currentUser);
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

  const CreateNewUserData = async (firstname, lastname, email, img_profile) => {
    let upload_img;
    const user_id = Array.from({length: 20}, () => Math.random().toString(36)[2] || Math.floor(Math.random() * 20)).join('');

    const q = query(collection(db, 'users'), where('email', '==', email));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length === 0) {
      
      if (!!img_profile) {
        var uniqueImgName = [firstname, lastname].join("_") + user_id;
        await uploadFiles(img_profile, uniqueImgName).then((res) => {
          upload_img = res;
        });
      } else {
        upload_img = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pngall.com%2Fprofile-png%2Fdownload%2F51525&psig=AOvVaw2Cy-FavCzDKct1N41XorEC&ust=1676560375535000&source=images&cd=vfe&ved=0CA8QjRxqFwoTCLiomZ_ol_0CFQAAAAAdAAAAABAE";
      }

      const record_id = await addDoc(collection(db, "users"), {
        id: user_id,
        email: email,
        firstname: firstname,
        lastname: lastname,
        profile: upload_img
      });

      setContextProfile({displayName: [firstname, lastname].join(" "), photoURL: upload_img, record_id: record_id, id: user_id});

    } else {
      return querySnapshot.docs[0].data();
    }
  }

  const setContextProfile = async(fields) => {
    await updateProfile(user, {...fields}).catch((err) => {
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

      const current_record = await CreateNewUserData(result.user.displayName.split(" ")[0], result.user.displayName.split(" ")[1], result.user.email, result.user.photoURL);

      if (current_record)
        result.user.photoURL = current_record.profile;

      // Savong the data of when it was created and last login
      result.user['lastLogin'] = result.user.metadata.lastSignInTime;
      result.user['createdAt'] = result.user.metadata.creationTime;

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

      throw new Error(error.message);
    });
  }

  return (
    <UserContext.Provider value={{ createUser, user, logOut, signIn, recoveryPassword, popUpProviderLogin, setContextProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
}