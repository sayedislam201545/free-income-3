const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const botSnap = await getDoc(doc(db, "settings", "bot_setting"));
        if (botSnap.exists()) setBotSettingData(botSnap.data());

        const devSnap = await getDoc(doc(db, "settings", "developer_profile"));
        if (devSnap.exists()) setDeveloperData(devSnap.data());

        const supportSnap = await getDoc(doc(db, "settings", "support"));
        if (supportSnap.exists() && supportSnap.data().agents) setSupportAgents(supportSnap.data().agents);

        const vipSnap = await getDoc(doc(db, "settings", "vip_plans"));
        if (vipSnap.exists() && vipSnap.data().plans) setVipPlans(vipSnap.data().plans);

        const adsSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
        if (adsSnap.exists()) {
          setAdsRewardsData(adsSnap.data() || {});
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    };
    fetchSettings();
  }, [editing]);`;

const newEffect = `  useEffect(() => {
    let unsubs: any[] = [];
    import("firebase/firestore").then(m => {
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "bot_setting"), (snap) => {
            if (snap.exists()) setBotSettingData(snap.data());
        }));
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "developer_profile"), (snap) => {
            if (snap.exists()) setDeveloperData(snap.data());
        }));
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "support"), (snap) => {
            if (snap.exists() && snap.data().agents) setSupportAgents(snap.data().agents);
        }));
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "vip_plans"), (snap) => {
            if (snap.exists() && snap.data().plans) setVipPlans(snap.data().plans);
        }));
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (snap) => {
            if (snap.exists()) setAdsRewardsData(snap.data() || {});
        }));
    });
    return () => unsubs.forEach(unsub => unsub());
  }, []);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/Admin.tsx', code);
