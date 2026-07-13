const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

code = code.replace(
  `     const fetchHistory = async () => {`,
  `     const fetchHistory = async () => {
         try {`
);

code = code.replace(
  `             setStreak(currentStreak);
         }
     };`,
  `             setStreak(currentStreak);
         }
         } catch (e) {
             console.error("fetchHistory error:", e);
         }
     };`
);

fs.writeFileSync('src/pages/CheckIn.tsx', code);
