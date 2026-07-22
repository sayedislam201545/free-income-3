const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const snap = await getDoc(doc(db, "settings", "ads_rewards_config"));
  console.log(snap.data());
}
test();
