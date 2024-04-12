// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-f108f.firebaseapp.com",
  projectId: "mern-estate-f108f",
  storageBucket: "mern-estate-f108f.appspot.com",
  messagingSenderId: "716258360212",
  appId: "1:716258360212:web:cf9e1dc962d26055782d81"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);