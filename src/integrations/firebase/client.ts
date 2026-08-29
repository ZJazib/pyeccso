import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import firebaseConfig from "../../../firebase-applet-config.json";

// Initialize Firebase App
export { firebaseConfig };
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with the database ID specified in firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Connection test helper
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const snap = await getDocFromServer(doc(db, "site_settings", "general"));
    if (snap.exists()) {
      console.log(`[Firebase] Connected successfully to Cloud Firestore (${firebaseConfig.firestoreDatabaseId})`);
    }
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.warn("[Firebase] Client is currently offline or unreachable.");
    } else {
      console.warn("[Firebase] Firestore connection notice:", error);
    }
    return false;
  }
}

// Test connection on boot when in browser environment
if (typeof window !== "undefined") {
  testFirebaseConnection().catch(() => {});
}
