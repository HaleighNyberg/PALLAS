
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyDqpcN8wLUi6SFh-PGYmGsUwRMWZpKYY8k",
  authDomain: "pallasartis-c873f.firebaseapp.com",
  projectId: "pallasartis-c873f",
  storageBucket: "pallasartis-c873f.appspot.com",
  messagingSenderId: "1003425851568",
  appId: "1:1003425851568:web:9fe46560183088dd663375",
  measurementId: "G-LJCDW8FVG8"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp); 

export { auth, db, storage }; 
