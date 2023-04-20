import { collection, getDocs, where, query, addDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";

const getDocsFirebase = async(search) => {

    const usersCollectionRef = collection(db, "users");

    const q = query(
        usersCollectionRef,
        where('email', '!=', auth.currentUser.email)
    );

    const users = [];

    await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        // Extract the data from each document
        const user = doc.data();
        if ( Object.values(user).find(f => f.toLowerCase().includes(search)) !== undefined )
            users.push(user);
        });
    });

    return users;

}

const updateFavorites = async(favorites) => {

    const user = auth.currentUser.email;

    const favoritesCollectionRef = collection(db, 'user_favorites');

    const q = query(favoritesCollectionRef, where('email', '==', user));

    let response = [];

    await getDocs(q).then(async(querySnapshot) => {

        if (favorites.length > 0) {
            favorites.forEach(async(fav) => {
    
                let fire = querySnapshot.docs.find(r => r.data().fav_id === fav);
    
                if (fire === undefined) {
                    await addDoc(collection(db, "user_favorites"), {
                        email: user,
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

export { getDocsFirebase, updateFavorites }