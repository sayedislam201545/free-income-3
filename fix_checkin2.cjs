const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

code = code.replace(
  `          await updateDoc(doc(db, 'users', user!.uid), {
              vaBalance: increment(reward)
          });`,
  `          const now = Date.now();
          await updateDoc(doc(db, 'users', user!.uid), {
              vaBalance: increment(reward),
              lastCheckIn: now
          });`
);
fs.writeFileSync('src/pages/CheckIn.tsx', code);
