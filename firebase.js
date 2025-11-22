import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCR4eTrTOY_98j6kB3ZWz43ZvcAu0InfIM",
    authDomain: "stateguessr-1234.firebaseapp.com",
    projectId: "stateguessr-1234",
    storageBucket: "stateguessr-1234.firebasestorage.app",
    messagingSenderId: "351794121935",
    appId: "1:351794121935:web:c60bd480d281b25fda7bba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app, "round-ids");

export { storage, db };
