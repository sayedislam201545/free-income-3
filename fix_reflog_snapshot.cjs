const fs = require('fs');
let code = fs.readFileSync('src/pages/ReferralsLog.tsx', 'utf8');

code = code.replace(
  /unsub = m\.onSnapshot\(q, \(snapshot\) => \{([\s\S]*?)setLogs\(logData\);\n\s*\}\);/g,
  `unsub = m.onSnapshot(q, (snapshot) => {$1setLogs(logData);\n        }, (error) => {\n            console.warn("ReferralsLog error", error);\n        });`
);
fs.writeFileSync('src/pages/ReferralsLog.tsx', code);
