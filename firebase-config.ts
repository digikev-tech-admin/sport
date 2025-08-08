// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCerscZk3_svvCGuIAjSS-SQNEswaa6IDM",
    authDomain: "sports-messaging.firebaseapp.com",
    projectId: "sports-messaging",
    storageBucket: "sports-messaging.firebasestorage.app",
    messagingSenderId: "497379128094",
    appId: "1:497379128094:web:5e02daf9432bb68fa24f0f",
    measurementId: "G-LKYRQ6CQYG"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);