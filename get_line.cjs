const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_clean.tsx', 'utf8');
let line = 1;
for (let i = 0; i <= 41856; i++) {
    if (code[i] === '\n') line++;
}
console.log("AdminSettings ends at line:", line);
