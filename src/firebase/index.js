import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD6RM_31XugdutoQ-TARUY8AHJNEKQu4dM",
    authDomain: "socialheat-bc45b.firebaseapp.com",
    projectId: "socialheat-bc45b",
    storageBucket: "socialheat-bc45b.appspot.com",
    messagingSenderId: "789274073463",
    appId: "1:789274073463:web:09d74e1995676546562972",
    measurementId: "G-H590KJBZV3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get firestore
const db = getFirestore(app);

// Initialize Auth
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { auth, db };
