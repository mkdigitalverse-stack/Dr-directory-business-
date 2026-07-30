import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configured from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDK0IiZxnXR5zAZLvR8c7kUhvncmVUdDW4",
  authDomain: "lucky-rarity-nx6pd.firebaseapp.com",
  projectId: "lucky-rarity-nx6pd",
  storageBucket: "lucky-rarity-nx6pd.firebasestorage.app",
  messagingSenderId: "1057468511510",
  appId: "1:1057468511510:web:d8af4f981113d0155e8c37"
};

const DATABASE_ID = "ai-studio-healthcaredirect-e528ebf7-7e4a-4157-b1d0-4eb9e3b22dcd";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, DATABASE_ID);
