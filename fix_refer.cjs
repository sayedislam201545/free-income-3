const fs = require('fs');
let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

const target = `const userRef = doc(db, "users", user!.uid);
          await updateDoc(userRef, {
             referredBy: refInput,
             vaBalance: increment(rewardAmount)
          });
          
          await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(referrerReward)
          });`;

const replacement = `const userRef = doc(db, "users", user!.uid);
          await updateDoc(userRef, {
             referredBy: refInput,
             vaBalance: increment(rewardAmount)
          });
          
          await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(referrerReward)
          });
          
          const { addDoc, collection } = await import("firebase/firestore");
          
          // Current user (referred)
          await addDoc(collection(db, 'transactions'), {
              userId: user!.uid.toString(),
              type: 'refer',
              amount: rewardAmount,
              status: 'completed',
              createdAt: Date.now(),
              note: 'Referred by a friend'
          });
          
          // Referrer
          await addDoc(collection(db, 'transactions'), {
              userId: refInput,
              type: 'refer',
              amount: referrerReward,
              status: 'completed',
              createdAt: Date.now(),
              note: 'Referral Bonus'
          });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Refer.tsx', code);
