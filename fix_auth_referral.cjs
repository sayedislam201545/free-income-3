const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const target = `await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(reward)
          });`;

const replacement = `await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(reward)
          });
          const { addDoc, collection } = await import("firebase/firestore");
          await addDoc(collection(db, 'transactions'), {
              userId: code,
              type: 'refer',
              amount: reward,
              status: 'completed',
              createdAt: Date.now(),
              note: 'Referral Bonus'
          });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Auth.tsx', code);
