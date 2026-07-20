const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_clean.tsx', 'utf8');
let start = code.indexOf('function AdminSettings() {');
let openBraces = 0;
let foundStart = false;
for (let i = start; i < code.length; i++) {
    if (code[i] === '{') {
        openBraces++;
        foundStart = true;
    } else if (code[i] === '}') {
        openBraces--;
        if (foundStart && openBraces === 0) {
            console.log("AdminSettings ends at char index:", i);
            break;
        }
    }
}
