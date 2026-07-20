const fs = require('fs');
const code = fs.readFileSync('src/pages/Admin_current.tsx', 'utf8');
function extractFunction(code, name) {
    const startStr = `function ${name}() {`;
    const startIdx = code.indexOf(startStr);
    if (startIdx === -1) return null;
    let braces = 0;
    let idx = startIdx + startStr.length;
    braces++;
    while (braces > 0 && idx < code.length) {
        if (code[idx] === '{') braces++;
        else if (code[idx] === '}') braces--;
        idx++;
    }
    return code.slice(startIdx, idx);
}
fs.writeFileSync('tasks.txt', extractFunction(code, 'AdminTasks'));
fs.writeFileSync('reqs.txt', extractFunction(code, 'AdminRequests'));
fs.writeFileSync('achieve.txt', extractFunction(code, 'AdminAchievements'));
