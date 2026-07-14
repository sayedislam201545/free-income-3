const fs = require('fs');
let content = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

const targetStr = `  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "ads_config"));
        if (snap.exists()) {
          setAdsConfig({ ...adsConfig, ...snap.data() });
        }
      } catch (e) {}
    };
    fetchConfig();
  }, []);`;

const newStr = `  const isVipUser = auth.currentUser ? auth.currentUser.isVip : false;

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "ads_config"));
        if (snap.exists()) {
          const data = snap.data();
          const userRef = auth.currentUser ? doc(db, "users", auth.currentUser.uid) : null;
          let userSnap = null;
          if (userRef) userSnap = await getDoc(userRef);
          
          let isVip = false;
          if (userSnap && userSnap.exists()) {
             const uData = userSnap.data();
             if (uData.isVip && uData.vipExpiry && uData.vipExpiry > Date.now()) {
                isVip = true;
             }
          }
          
          const specificConfig = isVip ? data.vipUser : data.normalUser;
          if (specificConfig) {
             setAdsConfig({ ...adsConfig, ...data, ...specificConfig });
          } else {
             setAdsConfig({ ...adsConfig, ...data });
          }
        }
      } catch (e) {}
    };
    fetchConfig();
  }, []);`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/AdDetail.tsx', content);
  console.log("Updated AdDetail");
}
