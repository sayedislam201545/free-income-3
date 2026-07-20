const fs = require('fs');

const backupCode = fs.readFileSync('src/pages/Admin_backup.tsx', 'utf8');
let currentCode = fs.readFileSync('src/pages/Admin_current.tsx', 'utf8');

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

const functionsToRestore = [
    "AdminSubmissions",
    "AdminUsers",
    "AdminAchievements",
    "AdminPayments"
];

for (const fn of functionsToRestore) {
    const backupFunc = extractFunction(backupCode, fn);
    const currentFunc = extractFunction(currentCode, fn);
    
    if (backupFunc && currentFunc) {
        currentCode = currentCode.replace(currentFunc, backupFunc);
        console.log(`Successfully restored ${fn}`);
    } else {
        console.log(`Failed to restore ${fn}`);
    }
}

fs.writeFileSync('src/pages/Admin_current.tsx', currentCode);
