const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
let start = code.indexOf('function AdminSettings() {');
let openBraces = 0;
let foundStart = false;
let lines = 1;
for (let i = 0; i < code.length; i++) {
    if (code[i] === '\n') lines++;
    if (i >= start) {
        if (code[i] === '{') {
            openBraces++;
            foundStart = true;
        } else if (code[i] === '}') {
            openBraces--;
            if (foundStart && openBraces === 0) {
                console.log("AdminSettings ends at line:", lines);
                break;
            }
        }
    }
}
