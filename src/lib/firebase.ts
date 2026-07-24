import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  projectId: "striking-burner-6d2jw",
  appId: "1:288006071395:web:e2ed31630a99cebab10456",
  apiKey: "AIzaSyAHa05W9fJJhZmx0rl0VbfIhlmar0CNubY",
  authDomain: "striking-burner-6d2jw.firebaseapp.com",
  storageBucket: "striking-burner-6d2jw.firebasestorage.app",
  messagingSenderId: "288006071395"
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({tabManager: persistentMultipleTabManager()}),
  experimentalForceLongPolling: true
}, "ai-studio-71eedf5e-9c7a-4be0-bcfb-aa80182d7219");

export const auth = getAuth(app);
export const storage = getStorage(app);
