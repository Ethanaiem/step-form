// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIAGr5GWMqbtDQx_FBLY9xJTd3qhOSRiM",
  authDomain: "multi-form-aba2f.firebaseapp.com",
  projectId: "multi-form-aba2f",
  storageBucket: "multi-form-aba2f.appspot.com",
  messagingSenderId: "769602273257",
  appId: "1:769602273257:web:52e2c7ff5adf14ad8e9578"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};