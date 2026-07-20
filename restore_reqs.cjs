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

const reqsCode = extractFunction(backupCode, 'AdminRequests');
const currentReqsCode = extractFunction(currentCode, 'AdminRequests');

if (reqsCode && currentReqsCode) {
    currentCode = currentCode.replace(currentReqsCode, reqsCode);
    fs.writeFileSync('src/pages/Admin_current.tsx', currentCode);
    console.log("Successfully restored AdminRequests");
} else {
    console.log("Failed to restore AdminRequests");
}
