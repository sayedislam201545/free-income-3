const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

code = code.replace(
  /const unsubscribe = onSnapshot\(usersRef, \(snapshot\) => \{([\s\S]*?)setTopUsers\(usersList\);\n\s*\}\);/g,
  `const unsubscribe = onSnapshot(usersRef, (snapshot) => {$1setTopUsers(usersList);\n    }, (error) => {\n      console.warn("Leaderboard snapshot error", error);\n    });`
);
fs.writeFileSync('src/pages/Leaderboard.tsx', code);
