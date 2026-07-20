const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
let openBraces = 0;
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    openBraces += (lines[i].match(/\{/g) || []).length;
    openBraces -= (lines[i].match(/\}/g) || []).length;
}
console.log("Total open braces:", openBraces);
