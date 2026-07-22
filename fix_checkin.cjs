const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

code = code.replace(/const baseReward = 30;/, 
`let baseReward = 30;
          try {
             const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
             if (configSnap.exists()) {
                const bonus = configSnap.data()?.settings?.dailyBonus;
                if (bonus) baseReward = bonus;
             }
          } catch(e) {}`);

// There is also: const reward = absoluteDay % 7 === 0 ? 100 : 30; // Day 7 is 100
// We need to fetch it in the component body so the UI reflects it.
code = code.replace(/const \[streak, setStreak\] = useState\(0\);/, 
`const [streak, setStreak] = useState(0);
  const [dailyBonusAmt, setDailyBonusAmt] = useState(30);

  useEffect(() => {
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
  }, []);`);

code = code.replace(/const reward = absoluteDay % 7 === 0 \? 100 : 30;/g, 'const reward = absoluteDay % 7 === 0 ? dailyBonusAmt * 3 : dailyBonusAmt;');

fs.writeFileSync('src/pages/CheckIn.tsx', code);
