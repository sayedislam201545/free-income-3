const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/\\`\\\$\{u\.firstName \|\| u\.first_name \|\| ''\} \\\$\{u\.lastName \|\| u\.last_name \|\| ''\}\\`/g, '`${u.firstName || u.first_name || ""} ${u.lastName || u.last_name || ""}`');

fs.writeFileSync('src/pages/Admin.tsx', code);
