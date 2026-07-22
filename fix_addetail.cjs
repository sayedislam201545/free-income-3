const fs = require('fs');
let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

code = code.replace(/const snap = await getDoc\(doc\(db, "settings", "ads_rewards_config"\)\);[\s\S]*?\} catch \(e\) \{\}/,
`const snap = await getDoc(doc(db, "settings", "ads_rewards_config"));
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
             setAdsConfig({ ...settings, ...specificConfig, adWatchDuration: settings.adsSecond || 15 });
          } else {
             setAdsConfig({ ...settings, adWatchDuration: settings.adsSecond || 15 });
          }
        }
      } catch (e) {}`);

fs.writeFileSync('src/pages/AdDetail.tsx', code);
