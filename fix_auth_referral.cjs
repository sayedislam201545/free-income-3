const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const oldHandleReferral = `  const handleReferral = async (code: string) => {
     if (!code) return null;
     try {
       const referrerRef = doc(db, 'users', code);
       const referrerSnap = await getDoc(referrerRef);
       if (referrerSnap.exists()) {
          const referrerData = referrerSnap.data();
          const isVip = referrerData?.isVip && referrerData?.vipExpiry && referrerData?.vipExpiry > Date.now();
          const reward = isVip ? Math.floor(250 * 1.1) : 250;
          
          // Increment referral count and reward referrer
          await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(reward)
          });
          return code;
       }
     } catch (e) {
       console.error("Error processing referral:", e);
     }
     return null;
  };`;

const newHandleReferral = `  const handleReferral = async (code: string) => {
     if (!code) return { code: null, newUserBonus: 0 };
     try {
       const referrerRef = doc(db, 'users', code);
       const referrerSnap = await getDoc(referrerRef);
       if (referrerSnap.exists()) {
          const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
          const config = configSnap.exists() ? configSnap.data().settings || {} : {};
          const baseReferrerReward = config.userReferBonus !== undefined ? config.userReferBonus : 250;
          const newUserBonus = config.newUserReferBonus !== undefined ? config.newUserReferBonus : 0;
          
          const referrerData = referrerSnap.data();
          const isVip = referrerData?.isVip && referrerData?.vipExpiry && referrerData?.vipExpiry > Date.now();
          const reward = isVip ? Math.floor(baseReferrerReward * 1.1) : baseReferrerReward;
          
          // Increment referral count and reward referrer
          await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(reward)
          });
          return { code, newUserBonus };
       }
     } catch (e) {
       console.error("Error processing referral:", e);
     }
     return { code: null, newUserBonus: 0 };
  };`;

code = code.replace(oldHandleReferral, newHandleReferral);
fs.writeFileSync('src/pages/Auth.tsx', code);
