const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

const target = `await addDoc(collection(db, 'daily_bonus_history'), {
              userId: user!.uid.toString(),
              date: Date.now(),
              reward
          });`;

const replacement = `await addDoc(collection(db, 'daily_bonus_history'), {
              userId: user!.uid.toString(),
              date: Date.now(),
              reward
          });
          
          await addDoc(collection(db, 'transactions'), {
              userId: user!.uid.toString(),
              type: 'daily_checkin',
              amount: reward,
              status: 'completed',
              createdAt: Date.now(),
              note: 'Daily Check-in Reward'
          });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/CheckIn.tsx', code);
