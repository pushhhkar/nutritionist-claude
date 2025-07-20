import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxNAYS029z1hPXGfqgbFmSSHinAjFowK0",
  authDomain: "nutritionist-claude.firebaseapp.com",
  projectId: "nutritionist-claude",
  storageBucket: "nutritionist-claude.firebasestorage.app",
  messagingSenderId: "714486382441",
  appId: "1:714486382441:web:6c56a17e46f6d3ed93c7f8",
  measurementId: "G-VVJE6M0J7E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);