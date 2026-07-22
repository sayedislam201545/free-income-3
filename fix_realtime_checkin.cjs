const fs = require('fs');

let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

const oldFetch = `  useEffect(() => {
     const fetchConfig = async () => {
        try {
           const { doc, getDoc } = await import("firebase/firestore");
           const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
           if (configSnap.exists()) {
              const bonus = configSnap.data()?.settings?.dailyBonus;
              if (bonus) setDailyBonusAmt(bonus);
           }
        } catch(e) {}
     };
     fetchConfig();
  }, []);`;

const newFetch = `  useEffect(() => {
     let unsubConfig = () => {};
     import("firebase/firestore").then(m => {
        unsubConfig = m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (snap) => {
           if (snap.exists()) {
              const bonus = snap.data()?.settings?.dailyBonus;
              if (bonus) setDailyBonusAmt(bonus);
           }
        });
     });
     return () => unsubConfig();
  }, []);`;

code = code.replace(oldFetch, newFetch);

// Wait, we also used getDoc inside CheckIn.tsx handleCheckIn.
// We can just rely on the dailyBonusAmt state instead of fetching it again.
const oldHandleCheckIn = `let baseReward = 30;
          try {
             const { doc, getDoc } = await import("firebase/firestore");
             const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
             if (configSnap.exists()) {
                const bonus = configSnap.data()?.settings?.dailyBonus;
                if (bonus) baseReward = bonus;
             }
          } catch(e) {}`;

const newHandleCheckIn = `let baseReward = dailyBonusAmt;`;

code = code.replace(oldHandleCheckIn, newHandleCheckIn);

fs.writeFileSync('src/pages/CheckIn.tsx', code);
