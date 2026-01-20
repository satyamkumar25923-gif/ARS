import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    function signup(email, password) {
        if (!auth) return Promise.reject("Firebase config invalid. Check src/firebase.js");
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        if (!auth) return Promise.reject("Firebase config invalid. Check src/firebase.js");
        return signInWithEmailAndPassword(auth, email, password);
    }

    function loginWithGoogle() {
        if (!auth) return Promise.reject("Firebase config invalid. Check src/firebase.js");
        return signInWithPopup(auth, googleProvider);
    }

    function logout() {
        if (!auth) return Promise.reject("Firebase config invalid. Check src/firebase.js");
        return signOut(auth);
    }

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
