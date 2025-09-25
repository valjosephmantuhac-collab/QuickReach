
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPyzKJndhKfk0iM3OBulZuuZml9tXLfv0",
  authDomain: "quickreach-f3ecd.firebaseapp.com",
  projectId: "quickreach-f3ecd",
  storageBucket: "quickreach-f3ecd.firebasestorage.app",
  messagingSenderId: "749896424976",
  appId: "1:749896424976:web:0141587f335b69861eb495"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const auth = getAuth(app)