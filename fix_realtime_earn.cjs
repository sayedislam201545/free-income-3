const fs = require('fs');

let code = fs.readFileSync('src/pages/Earn.tsx', 'utf8');

const oldFetch = `  useEffect(() => {
    if (!user) return;
    const fetchMiningState = async () => {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
        if (configSnap.exists()) {
           const rate = configSnap.data()?.settings?.miningRate;
           if (rate) setMiningReward(rate);
        }
      } catch (e) {}

      const docRef = doc(db, 'users', user.uid);`;

const newFetch = `  useEffect(() => {
     let unsubConfig = () => {};
     import("firebase/firestore").then(m => {
        unsubConfig = m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (snap) => {
           if (snap.exists()) {
               const rate = snap.data()?.settings?.miningRate;
               if (rate) setMiningReward(rate);
           }
        });
     });
     return () => unsubConfig();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchMiningState = async () => {
      const docRef = doc(db, 'users', user.uid);`;

code = code.replace(oldFetch, newFetch);
fs.writeFileSync('src/pages/Earn.tsx', code);
