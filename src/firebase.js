import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBGc_sgqcDBClL3omCNJS5wip2JkaeAxzA",
    authDomain: "instagram-8d487.firebaseapp.com",
    databaseURL: "https://instagram-8d487-default-rtdb.firebaseio.com",
    projectId: "instagram-8d487",
    storageBucket: "instagram-8d487.appspot.com",
    messagingSenderId: "988122536281",
    appId: "1:988122536281:web:37c2b2701aebb26c1cd448",
    measurementId: "G-NDZYE5B4SB"
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};
