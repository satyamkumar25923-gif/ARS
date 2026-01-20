import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCnUx8vqBwXZd-YvrhPe98HLy9SOOsOpYU",
    authDomain: "ars-clg.firebaseapp.com",
    projectId: "ars-clg",
    storageBucket: "ars-clg.firebasestorage.app",
    messagingSenderId: "572663087517",
    appId: "1:572663087517:web:85644cee30d8b8051eaf74",
    measurementId: "G-TJVPW9MJ2Z"
};

// Initialize Firebase
let app;
let auth;
let googleProvider;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
} catch (error) {
    console.error("Firebase Initialization Error:", error);
}

export { auth, googleProvider };
