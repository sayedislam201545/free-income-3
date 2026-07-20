const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
let openBraces = 0;
let lines = code.split('\n');
for (let i = 0; i < lines.length; i++) {
    openBraces += (lines[i].match(/\{/g) || []).length;
    openBraces -= (lines[i].match(/\}/g) || []).length;
    if (lines[i].includes('function ')) {
        console.log(`At line ${i+1}: ${lines[i].trim()} -> open braces after this line: ${openBraces}`);
    }
}
console.log("Total open braces:", openBraces);
