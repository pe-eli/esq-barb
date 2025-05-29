// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAiZRJmTAt3ESCyWWgfqkWSrfIFFKKp8t0",
  authDomain: "barbearia-ec7d6.firebaseapp.com",
  projectId: "barbearia-ec7d6",
  storageBucket: "barbearia-ec7d6.firebasestorage.app",
  messagingSenderId: "378676367290",
  appId: "1:378676367290:web:22cb8fd69216ecb3fd9783",
  measurementId: "G-20SSDKKNF2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

