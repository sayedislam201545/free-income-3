const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

let start = code.indexOf('function AdminSettings() {');
let openBraces = 0;
let i = start;
let foundStart = false;
let lines = 0;
while(i < code.length) {
    if (code[i] === '\n') lines++;
    if (code[i] === '{') {
        openBraces++;
        foundStart = true;
    } else if (code[i] === '}') {
        openBraces--;
        if (foundStart && openBraces === 0) {
            console.log("Ends at line offset: ", lines);
            break;
        }
    }
    i++;
}
