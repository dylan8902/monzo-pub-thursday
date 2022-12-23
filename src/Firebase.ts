import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQK-b0U2EGu9Czga_GCv2IBM4MhqjrzSA",
  authDomain: "monzo-pub-thursday.firebaseapp.com",
  projectId: "monzo-pub-thursday",
  storageBucket: "monzo-pub-thursday.appspot.com",
  messagingSenderId: "1046796834506",
  appId: "1:1046796834506:web:3c6b8fe880dd3e13578633",
  measurementId: "G-PWZHCH9NPL"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
