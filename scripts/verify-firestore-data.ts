import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function checkCollections() {
  const collections = [
    "content_items",
    "site_settings",
    "user_roles",
    "contact_messages",
    "applications",
    "audit_logs",
  ];

  console.log("🔍 Verifying Firestore Database Collections...\n");

  for (const col of collections) {
    try {
      const snap = await getDocs(collection(db, col));
      console.log(`📊 Collection '${col}': ${snap.size} documents found.`);
      snap.forEach((d) => {
        const data = d.data();
        const label = data.type ? `[${data.type}] ${data.slug || d.id}` : (data.key || data.email || data.fullName || data.action || d.id);
        console.log(`   - ${d.id}: ${label}`);
      });
    } catch (err: any) {
      console.error(`❌ Error querying collection '${col}':`, err?.message);
    }
    console.log("");
  }
  process.exit(0);
}

checkCollections().catch((err) => {
  console.error("Fatal verification error:", err);
  process.exit(1);
});
