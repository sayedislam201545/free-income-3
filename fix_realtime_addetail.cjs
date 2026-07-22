const fs = require('fs');

let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

const oldFetch = `  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "ads_rewards_config"));
        if (snap.exists()) {
          const data = snap.data();
          const userRef = auth.currentUser ? doc(db, "users", auth.currentUser.uid) : null;
          let userSnap = null;
          if (userRef) userSnap = await getDoc(userRef);
          
          let isVip = false;
          if (userSnap && userSnap.exists()) {
             const uData = userSnap.data();
             if (uData.isVip === true) {
                isVip = true;
             }
          }
          
          const specificConfig = isVip ? data.vip : data.normal;
          const settings = data.settings || {};
          if (specificConfig) {
             setAdsConfig({ 
                 ...settings, 
                 ...specificConfig, 
                 adWatchDuration: settings.adsSecond || 15,
                 dailyAdsLimit: specificConfig.adsLimit || 50,
                 rewardPerAd: specificConfig.reward || 50
             });
          } else {
             setAdsConfig({ 
                 ...settings, 
                 adWatchDuration: settings.adsSecond || 15,
                 dailyAdsLimit: 50,
                 rewardPerAd: 50
             });
          }
        }
      } catch (e) {}
    };
    fetchConfig();
  }, []);`;

const newFetch = `  useEffect(() => {
    import("firebase/firestore").then(m => {
       const unsubConfig = m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const specificConfig = isVipUser ? data.vip : data.normal;
            const settings = data.settings || {};
            if (specificConfig) {
               setAdsConfig({ 
                   ...settings, 
                   ...specificConfig, 
                   adWatchDuration: settings.adsSecond || 15,
                   dailyAdsLimit: specificConfig.adsLimit || 50,
                   rewardPerAd: specificConfig.reward || 50
               });
            } else {
               setAdsConfig({ 
                   ...settings, 
                   adWatchDuration: settings.adsSecond || 15,
                   dailyAdsLimit: 50,
                   rewardPerAd: 50
               });
            }
          }
       });
       return () => unsubConfig();
    });
  }, [isVipUser]);`;

code = code.replace(oldFetch, newFetch);
fs.writeFileSync('src/pages/AdDetail.tsx', code);
