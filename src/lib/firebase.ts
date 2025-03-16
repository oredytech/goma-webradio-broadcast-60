import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBJ_P0w3penkfApveSvsaj9jfGvmLBMozY",
  authDomain: "goma-webradio.firebaseapp.com",
  projectId: "goma-webradio",
  storageBucket: "goma-webradio.firebasestorage.app",
  messagingSenderId: "409293929941",
  appId: "1:409293929941:web:f4b43da4e7df96b0a4515c",
  measurementId: "G-1ZNC0G7R5E"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);