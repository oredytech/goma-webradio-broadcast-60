
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDoKLfXlxJW0r3ezAouLMgV1Py2hTVo08Q",
  authDomain: "goma-webradio-a225b.firebaseapp.com",
  projectId: "goma-webradio-a225b",
  storageBucket: "goma-webradio-a225b.firebasestorage.app",
  messagingSenderId: "857289501110",
  appId: "1:857289501110:web:5a0b72fb37fdcba387f917",
  measurementId: "G-QBG2QXRVR1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
