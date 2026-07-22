import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

const firebaseConfig = {
  projectId: "ai-studio-71eedf5e-9c7a-4be0-bcfb-aa80182d7219",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function read() {
  const q = query(collection(db, "users"), limit(5));
  const snap = await getDocs(q);
  snap.forEach(doc => console.log(doc.id, doc.data()));
  process.exit(0);
}
read();
