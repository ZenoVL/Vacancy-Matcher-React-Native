// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getDatabase} from "firebase/database";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: "AIzaSyD0nGfxr_JDLj9QtIV8YtrpaPGqYyl8qD4",
    authDomain: "vacancy-matcher-3musketeers.firebaseapp.com",
    databaseURL: "https://vacancy-matcher-3musketeers-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vacancy-matcher-3musketeers",
    storageBucket: "vacancy-matcher-3musketeers.appspot.com",
    messagingSenderId: "545729975739",
    appId: "1:545729975739:web:9b8c2973c452753ba2209e",
    measurementId: "G-YCXPSNWKH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const storage = getStorage(app);

// export const login = async(user, success_callback, failed_callback) => {
//     await firebase.auth()
//         .signInWithEmailAndPassword(user.email, user.password)
//         .then(success_callback, failed_callback);
// }
