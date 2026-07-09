const fs = require('fs');
let code = fs.readFileSync('src/pages/ReferralsLog.tsx', 'utf8');
code = code.replace("const inviteCode = \\`R_\\${user.uid.substring(0, 6).toUpperCase()}\\`;", "const inviteCode = `R_${user.uid.substring(0, 6).toUpperCase()}`;");
fs.writeFileSync('src/pages/ReferralsLog.tsx', code);
