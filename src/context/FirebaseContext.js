import { collection, getDocs, where, query, addDoc, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { GetCardSet } from "./PokemonContext";

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

    const response = [];
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

    return response;

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

export { getSearchDocs, updateFavorites, createFirebaseDocs }