const fs = require('fs');
let code = fs.readFileSync('src/pages/Spin.tsx', 'utf8');

const target = `if (user && amount > 0) {
          const { increment } = await import("firebase/firestore");
          await updateDoc(doc(db, 'users', user.uid), {
              vaBalance: increment(amount)
          });
      }`;

const replacement = `if (user && amount > 0) {
          const { increment, collection, addDoc } = await import("firebase/firestore");
          await updateDoc(doc(db, 'users', user.uid), {
              vaBalance: increment(amount)
          });
          await addDoc(collection(db, 'transactions'), {
              userId: user.uid.toString(),
              type: 'lucky_draw_win',
              amount: amount,
              status: 'completed',
              createdAt: Date.now(),
              note: 'Lucky Draw Reward'
          });
      }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Spin.tsx', code);
