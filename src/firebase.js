import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBEQ5CAs_vme_OjmW2HCNiOo-pnNk1j0Ms",
    authDomain: "instagram-clone-90f3f.firebaseapp.com",
    databaseURL: "https://instagram-clone-90f3f.firebaseio.com",
    projectId: "instagram-clone-90f3f",
    storageBucket: "instagram-clone-90f3f.appspot.com",
    messagingSenderId: "754918176811",
    appId: "1:754918176811:web:e02cb6a96902c2a43c526e",
    measurementId: "G-897HQJPQYG"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { firebaseApp ,db, auth, storage }
// export default db;