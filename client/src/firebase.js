// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-2bd35.firebaseapp.com",
  projectId: "mern-blog-2bd35",
  storageBucket: "mern-blog-2bd35.appspot.com",
  messagingSenderId: "1087280745008",
  appId: "1:1087280745008:web:12e87f10371dc10e103bf5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);