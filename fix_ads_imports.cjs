const fs = require('fs');

let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    let unsubConfig = () => {};
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
               setAdsConfig({ ...data.settings, ...specificConfig, dailyAdsLimit: specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : (isVipUser ? 20 : 10) });
            } else {
               setAdsConfig({ ...data.settings, dailyAdsLimit: (isVipUser ? 20 : 10) });
            }
          }
       });
    });
        
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where("active", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const adsList = snapshot.docs.map(doc => ({
           id: doc.id,
           ...doc.data(),
           fbId: doc.id
        }));
        
        // Merge real data with hardcoded data
        const mergedTasks = HARDCODED_ADS.map((hardcodedTask, index) => {
          if (adsList[index]) {
             return {
                ...hardcodedTask,
                ...adsList[index],
                fbId: adsList[index].id
             };
          }
          return hardcodedTask;
        });
        setTasks(mergedTasks);
      } else {
        setTasks(HARDCODED_ADS);
      }
    }, (error) => {
      console.warn("Ads fetch error:", error);
      setTasks(HARDCODED_ADS);
    });
    return () => { unsubscribe(); unsubConfig(); unsubBoxes(); };
  }, [isVipUser]);`;

const newEffect = `  useEffect(() => {
    const { doc } = require("firebase/firestore");
    const unsubBoxes = onSnapshot(doc(db, "settings", "ads_boxes"), (snap) => {
       if (snap.exists()) setAdsBoxes(snap.data().boxes || []);
    });
    const unsubConfig = onSnapshot(doc(db, "settings", "ads_rewards_config"), (configSnap) => {
       if (configSnap.exists()) {
         const data = configSnap.data();
         const specificConfig = isVipUser ? data.vip : data.normal;
         if (specificConfig) {
            setAdsConfig({ ...(data.settings || {}), ...specificConfig, dailyAdsLimit: specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : (isVipUser ? 20 : 10) });
         } else {
            setAdsConfig({ ...(data.settings || {}), dailyAdsLimit: (isVipUser ? 20 : 10) });
         }
       }
    });
        
    const adsRef = collection(db, 'ads');
    const q = query(adsRef, where("active", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const adsList = snapshot.docs.map(doc => ({
           id: doc.id,
           ...doc.data(),
           fbId: doc.id
        }));
        
        // Merge real data with hardcoded data
        const mergedTasks = HARDCODED_ADS.map((hardcodedTask, index) => {
          if (adsList[index]) {
             return {
                ...hardcodedTask,
                ...adsList[index],
                fbId: adsList[index].id
             };
          }
          return hardcodedTask;
        });
        setTasks(mergedTasks);
      } else {
        setTasks(HARDCODED_ADS);
      }
    }, (error) => {
      console.warn("Ads fetch error:", error);
      setTasks(HARDCODED_ADS);
    });
    return () => { unsubscribe(); unsubConfig(); unsubBoxes(); };
  }, [isVipUser]);`;

code = code.replace(oldEffect, newEffect);
code = code.replace(/import \{ collection, onSnapshot, query, where \} from "firebase\/firestore";/, 'import { collection, onSnapshot, query, where, doc } from "firebase/firestore";');
// Remove the require since we imported doc above
code = code.replace(/const \{ doc \} = require\("firebase\/firestore"\);/, '');

fs.writeFileSync('src/pages/Ads.tsx', code);
