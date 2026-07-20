const fs = require('fs');
const code = fs.readFileSync('src/pages/Admin_current.tsx', 'utf8');

function getFuncLength(code, name) {
    const startStr = `function ${name}(`;
    const startIdx = code.indexOf(startStr);
    if (startIdx === -1) return 0;
    
    let braces = 0;
    let idx = startIdx + startStr.length;
    while(code[idx] !== '{' && idx < code.length) idx++;
    
    braces++;
    idx++;
    while (braces > 0 && idx < code.length) {
        if (code[idx] === '{') braces++;
        else if (code[idx] === '}') braces--;
        idx++;
    }
    return code.slice(startIdx, idx).split('\n').length;
}

const funcs = [
    "AdminLayout",
    "AdminDashboard",
    "AdminTasks",
    "AdminSettings",
    "AdminSubmissions",
    "AdminUsers",
    "AdminAchievements",
    "AdminPayments",
    "AdminRequests",
    "CoinValuesEditor",
    "AdsRewardsEditor",
    "FeatureTogglesEditor"
];

for(const fn of funcs) {
    console.log(`${fn}: ${getFuncLength(code, fn)} lines`);
}
