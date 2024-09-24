import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPxBQ3a8_8ys7BvkHY_-9eViK7dZSWRb0",
  authDomain: "soft-8e534.firebaseapp.com",
  projectId: "soft-8e534",
  storageBucket: "soft-8e534.appspot.com",
  messagingSenderId: "1022812444776",
  appId: "1:1022812444776:web:393d6a43196b217bbd83dd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase App Initialized:', app.name);

// Initialize Firebase Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
console.log('Firebase Auth Initialized:', auth);

// Initialize Firestore
const db = getFirestore(app);
console.log('Firestore Initialized:', db);

export { db, auth };
