import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeFirestore, getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseConfig from "../../../firebase-applet-config.json";

// Initialize Firebase App
export { firebaseConfig };
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with robust long-polling auto-detection for iframes/proxies
let firestoreInstance;
try {
  firestoreInstance = initializeFirestore(
    app,
    {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true,
    },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  firestoreInstance = getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

export const db = firestoreInstance;

// Initialize Authentication
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

// Connection test helper with graceful fallback
export async function testFirebaseConnection(): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "site_settings", "general"));
    if (snap.exists()) {
      console.log(`[Firebase] Connected successfully to Cloud Firestore (${firebaseConfig.firestoreDatabaseId})`);
    }
    return true;
  } catch (error: unknown) {
    // Graceful silent fallback to offline mode if network is initially negotiating
    return false;
  }
}

// Test connection on boot when in browser environment
if (typeof window !== "undefined") {
  testFirebaseConnection().catch(() => {});
}

