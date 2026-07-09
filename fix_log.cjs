const fs = require('fs');
let code = fs.readFileSync('src/pages/ReferralsLog.tsx', 'utf8');
code = code.replace(/\\`R_\\\\\$\{user.uid.substring\(0, 6\).toUpperCase\(\)\}\\`/g, '`R_${user.uid.substring(0, 6).toUpperCase()}`');
fs.writeFileSync('src/pages/ReferralsLog.tsx', code);
