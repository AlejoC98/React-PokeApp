import { collection, getDocs, where, query, addDoc, deleteDoc, doc, updateDoc, or } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { GetCardSet } from "./PokemonContext";
import { getDownloadURL, uploadBytesResumable, ref } from 'firebase/storage';

const searchData = JSON.parse(localStorage.getItem('searchData'));

const createFirebaseDocs = async() => {
    const sets = await GetCardSet();

    sets.forEach(async(set, ind) => {
        await addDoc(collection(db, "cardsets"), {
            id: set.id,
            name: set.name,
            profile: set.images.logo,
            series: set.series
        });

        const setContent = await GetCardSet('filter_id', {id : set.id});

        setContent.content.forEach(async(card, i) => {
            await addDoc(collection(db, "cards"), {
                cardset_id: set.id,
                id: card.id,
                name: card.name,
                profile: card.images.small,
                setname: set.name
            });
        });

    });

}

const getSearchDocs = async() => {

    let response = [];

    if (searchData === null) {
    
        // Search sets
        const setsCollectionRef = collection(db, "cardsets");
    
        const sq = query(
            setsCollectionRef,
        );
    
        await getDocs(sq).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // Extract the data from each document
            const rescord = doc.data();
            response.push(rescord);
            });
        });
    
        // Search cards
        const cardsCollectionRef = collection(db, "cards");
    
        const cq = query(
            cardsCollectionRef,
        );
    
        await getDocs(cq).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            // Extract the data from each document
            const rescord = doc.data();
            response.push(rescord);
            });
        });
    
        if (response.length > 0 )
            localStorage.setItem('searchData', JSON.stringify(response));

    } else {
        response = [...response, ...searchData];
    }

     // Search users
     const usersCollectionRef = collection(db, "users");

     const uq = query(
         usersCollectionRef,
         where('email', '!=', auth.currentUser.email)
     );
 
 
     await getDocs(uq).then((querySnapshot) => {
         querySnapshot.forEach((doc) => {
         // Extract the data from each document
         const rescord = doc.data();
         response.push(rescord);
         });
     });

    return response;

}

const updateFavorites = async(favorites, user = auth.currentUser) => {

    const favoritesCollectionRef = collection(db, 'user_favorites');

    const q = query(favoritesCollectionRef, where('user', '==', user.email));

    let response = [];

    await getDocs(q).then(async(querySnapshot) => {

        if (favorites.length > 0) {
            favorites.forEach(async(fav) => {
    
                let fire = querySnapshot.docs.find(r => r.data().fav_id === fav);
    
                if (fire === undefined) {
                    await addDoc(collection(db, "user_favorites"), {
                        user: user.email,
                        fav_id: fav,
                    });
                } else {

                    const recordRef = doc(favoritesCollectionRef, fire.id);

                    try {
                        await deleteDoc(recordRef);
                    } catch (error) {
                        console.log(error);
                    }
                }
    
            });
        } else {
            if (querySnapshot.docs.length > 0)
                querySnapshot.forEach((doc) => {
                    // Extract the data from each document
                    response.push(doc.data().fav_id);
                });
        }
    });

    return response;
}

const sendFriendRequest = async(user) => {

    let response;
    const userFriendRequestRef = collection(db, 'user_friends');
    // const senderData = await queryCollection('users', [{field: 'email', operator: '==', value: auth.currentUser.email}]);

    try {

        createUserNotifications({user: user.email, title: 'New friend Request', text: `${user.firstname} ${user.lastname} wants to be your friend!`, link: auth.currentUser.id, status: false});
    
        await addDoc(userFriendRequestRef, {
            user: auth.currentUser.email,
            friend: user.email,
            status: false,
        });

        response = 'Request Sent';
    } catch (error) {
        response = error.message;
    }

    return response;
}

const getUserNotification = async() => {

    const userNotificationRef = collection(db, 'user_notifications');

    let notifications = [];

    const q = query(
        userNotificationRef,
        where('user', '==', auth.currentUser.email),
    );

    await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const rescord = doc.data();
            rescord['record_id'] = doc.id;
            notifications.push(rescord);
        });
    });
    
    return notifications;
}

const getUserFriends = async(user = auth.currentUser) => {

    const friendsRef = collection(db, 'user_friends');
    const usersRef = collection(db, 'users');
    const response = [];

    const fq = query(
        friendsRef,
        or(where('user', '==', user.email),
        where('friend', '==', user.email))
    );

    try {
        const friendsSnapshot = await getDocs(fq);
        const friendsData = friendsSnapshot.docs.map(doc => doc.data());
        let promises;

        if (Object.keys(friendsData[0]).find(s => friendsData[0][s] === user.email) === 'friend') {
            promises = friendsData.map(fri => getDocs(query(usersRef, where('email', '==', fri.user))));
        } else {
            promises = friendsData.map(fri => getDocs(query(usersRef, where('email', '==', fri.friend))));
        }

        const otherSnapshot = await Promise.all(promises);

        otherSnapshot.forEach(snapshot => {
            snapshot.docs.forEach(record => {
                response.push(record.data());
            });
        });

        return response;
    } catch (error) {
        console.error(error);
    }

}

const queryCollection = async(model, filters) => {
    // Search users
    let usersCollectionRef = collection(db, model);
    let response = [];

    filters.forEach((filt) => {
        usersCollectionRef = query(usersCollectionRef, where(filt.field, filt.operator, filt.value));
    });


    await getDocs(usersCollectionRef).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const record = doc.data();
            record['record_id'] = doc.id;
            querySnapshot.docs.length > 1 ? response.push(record) : response = record;
        });
    });

    return response;
}

const updateCollection = async(model, record, fields) => {

    // const updateRef = collection(db, model, filter);
    const updateRef = doc(db, model, record);

    let response;

    await updateDoc(updateRef, {
        ...fields
    }).then(() => {
        response = true;
    }).catch((err) => {
        throw new Error(err.message);
    });

    return response
}

const deleteCollection =async(model, record) => {
    const deleteRef = doc(db, model, record);

    let response;

    await deleteDoc(deleteRef).then(() => {
        response = true;
    }).catch((err) => {
        throw new Error(err.message);
    });

    return response;
}

const createUserNotifications = async(data) => {
    const userNotificationRef = collection(db, 'user_notifications');
    let response;

    try {
        await addDoc(userNotificationRef, {
            user: data.user,
            title: data.title,
            text: data.text,
            link: data.link,
            status: data.status
        });

        response = true;
    } catch (error) {
        throw new Error(error.message);
    }

    return response;
}

const uploadFiles = async(img_profile, fileName = '') => {
    let response;
    if (typeof img_profile !== 'string') {
        const metadata = {
          contentType: 'image/jpeg'
        }
        
        if (fileName === '')
            fileName = [auth.currentUser.displayName].join("_") + auth.currentUser.id;
        
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'users_profiles/' + fileName);
        // const uploadTask = await uploadBytesResumable(storageRef, img_profile.buffer, metadata);
        const uploadTask = await uploadBytesResumable(storageRef, img_profile, metadata);

        response = await getDownloadURL(uploadTask.ref);
      } else {
        response = img_profile;
      }

    return response;
}

export { getSearchDocs, updateFavorites, createFirebaseDocs, sendFriendRequest, getUserNotification, queryCollection, updateCollection, createUserNotifications, deleteCollection, getUserFriends, uploadFiles }