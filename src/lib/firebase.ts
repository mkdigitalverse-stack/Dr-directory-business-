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
auth.useDeviceLanguage();
export const db = getFirestore(app, DATABASE_ID);

/**
 * Formats Firebase Auth errors into clear, user-friendly instructions.
 */
export function formatAuthError(err: any): string {
  if (!err) return "An unknown authentication error occurred.";
  const code = err.code || "";
  const message = err.message || "";

  switch (code) {
    case "auth/operation-not-allowed":
      return "The requested authentication provider (Email/Password or Phone/OTP) is currently disabled in your Firebase Console under Authentication > Sign-in method. Please enable Email/Password in Firebase Console, or click Instant Access below.";
    case "auth/email-already-in-use":
      return "An account with this email address already exists. Please sign in or use password reset.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters long.";
    case "auth/user-not-found":
      return "No account found with this email. Please check your spelling or register a new account.";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password combination. Please try again.";
    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing authentication.";
    case "auth/popup-blocked":
      return "Sign-in popup was blocked by your browser. Please allow popups for this site.";
    case "auth/too-many-requests":
      return "Too many unsuccessful attempts. Access temporarily locked. Reset password or try again later.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA verification failed. Please try again.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email using a different sign-in provider.";
    default:
      if (message.includes("operation-not-allowed")) {
        return "Authentication provider is disabled in Firebase Console. Enable Email/Password or Phone in Authentication > Sign-in method.";
      }
      return message || "An error occurred during authentication.";
  }
}

