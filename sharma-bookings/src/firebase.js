import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "sharma-resident-stay-s-640e5.firebaseapp.com",
  projectId: "sharma-resident-stay-s-640e5",
  storageBucket: "sharma-resident-stay-s-640e5.firebasestorage.app",
  messagingSenderId: "865016747269",
  appId: "1:865016747269:web:ef60211b1289328693d36c"
};

const app = initializeApp(firebaseConfig);

export default app;