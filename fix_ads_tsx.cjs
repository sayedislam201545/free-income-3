const fs = require('fs');
let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');

// The original logic:
// const specificConfig = isVipUser ? data.vip : data.normal;
// if (specificConfig) { setAdsConfig({ ...data, ...specificConfig }); } else { setAdsConfig(data); }

// Now we need to handle the new schema and map dailyAdsLimit
// The state adsConfig is used like:
// limit: `0/${adsConfig.dailyAdsLimit || 50}`,
// I will ensure setAdsConfig sets an object that has dailyAdsLimit.

code = code.replace(/const configSnap = await import\("firebase\/firestore"\)\.then\(m => m\.getDoc\(m\.doc\(db, "settings", "ads_rewards_config"\)\)\);[\s\S]*?\} catch \(e\) \{\}/, 
`const configSnap = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "settings", "ads_rewards_config")));
        if (configSnap.exists()) {
            const data = configSnap.data();
            const specificConfig = isVipUser ? data.vip : data.normal;
            if (specificConfig) {
               setAdsConfig({ ...data.settings, ...specificConfig, dailyAdsLimit: specificConfig.adsLimit || 50 });
            } else {
               setAdsConfig({ ...data.settings, dailyAdsLimit: 50 });
            }
        }
      } catch (e) {}`);

fs.writeFileSync('src/pages/Ads.tsx', code);
