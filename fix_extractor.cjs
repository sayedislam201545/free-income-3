const fs = require('fs');

function extractFunction(code, name) {
    const startStr = `function ${name}(`;
    let startIdx = code.indexOf(startStr);
    if (startIdx === -1) {
        return null;
    }
    
    // Find opening brace
    let braceIdx = code.indexOf('{', startIdx);
    if (braceIdx === -1) return null;
    
    let braces = 1;
    let idx = braceIdx + 1;
    while (braces > 0 && idx < code.length) {
        if (code[idx] === '{') braces++;
        else if (code[idx] === '}') braces--;
        idx++;
    }
    
    return code.substring(startIdx, idx);
}

// Write the extraction for all
let finalFiles = [];

// AdminDashboard
let dashSrc = fs.readFileSync('fix_admin_dash_2.cjs', 'utf8');
finalFiles.push(extractFunction(dashSrc, 'AdminDashboard'));

// AdminSubmissions
let subSrc = fs.readFileSync('fix_submissions.cjs', 'utf8');
finalFiles.push(extractFunction(subSrc, 'AdminSubmissions'));

// AdminSettings
let settingsSrc = fs.readFileSync('fix_admin_settings_now.cjs', 'utf8');
finalFiles.push(extractFunction(settingsSrc, 'AdminSettings'));

// AdminVIP
let vipSrc = fs.readFileSync('fix_admin_vip.cjs', 'utf8');
finalFiles.push(extractFunction(vipSrc, 'AdminVIP'));

console.log(finalFiles.map(x => x ? "OK" : "FAIL").join(', '));
fs.writeFileSync('extracted.json', JSON.stringify(finalFiles));
