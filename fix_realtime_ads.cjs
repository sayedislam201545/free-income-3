const fs = require('fs');

let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');

const oldFetch = `const fetchBoxesAndConfig = async () => {
      try {
        const snap = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "settings", "ads_boxes")));
        if (snap.exists()) {
          setAdsBoxes(snap.data().boxes || []);
        }
        
        const configSnap = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "settings", "ads_rewards_config")));
        if (configSnap.exists()) {
            const data = configSnap.data();
            const specificConfig = isVipUser ? data.vip : data.normal;
            if (specificConfig) {
               setAdsConfig({ ...data.settings, ...specificConfig, dailyAdsLimit: specificConfig.adsLimit || 50 });
            } else {
               setAdsConfig({ ...data.settings, dailyAdsLimit: 50 });
            }
        }
      } catch (e) {}
    };
    fetchBoxesAndConfig();`;

const newFetch = `let unsubConfig = () => {};
    let unsubBoxes = () => {};
    import("firebase/firestore").then(m => {
       unsubBoxes = m.onSnapshot(m.doc(db, "settings", "ads_boxes"), (snap) => {
          if (snap.exists()) setAdsBoxes(snap.data().boxes || []);
       });
       unsubConfig = m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (configSnap) => {
          if (configSnap.exists()) {
            const data = configSnap.data();
            const specificConfig = isVipUser ? data.vip : data.normal;
            if (specificConfig) {
               setAdsConfig({ ...data.settings, ...specificConfig, dailyAdsLimit: specificConfig.adsLimit || 50 });
            } else {
               setAdsConfig({ ...data.settings, dailyAdsLimit: 50 });
            }
          }
       });
    });`;

code = code.replace(oldFetch, newFetch);
code = code.replace(/return \(\) => unsubscribe\(\);/, 'return () => { unsubscribe(); unsubConfig(); unsubBoxes(); };');

fs.writeFileSync('src/pages/Ads.tsx', code);
