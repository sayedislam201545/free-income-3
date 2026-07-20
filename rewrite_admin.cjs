const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

function extractFunction(name) {
    let searchStr = `function ${name}(`;
    let start = code.indexOf(searchStr);
    if (start === -1) {
        searchStr = `export default function ${name}(`;
        start = code.indexOf(searchStr);
        if (start === -1) {
            console.log("NOT FOUND: " + name);
            return "";
        }
    }
    
    let openBraces = 0;
    let foundStart = false;
    let end = -1;
    for (let i = start; i < code.length; i++) {
        if (code[i] === '{') {
            openBraces++;
            foundStart = true;
        } else if (code[i] === '}') {
            openBraces--;
            if (foundStart && openBraces === 0) {
                end = i;
                break;
            }
        }
    }
    
    if (end !== -1) {
        // Find any preceding comments or exports? Let's just return the block.
        return code.substring(start, end + 1) + "\n\n";
    }
    console.log("FAILED TO PARSE: " + name);
    return "";
}

const imports = code.substring(0, code.indexOf('export default function AdminLayout() {'));

let finalCode = imports + "\n";
finalCode += extractFunction("AdminLayout");
finalCode += extractFunction("AdminDashboard");
finalCode += extractFunction("AdminTasks");
finalCode += extractFunction("AdminSettings");
finalCode += extractFunction("AdminSubmissions");
finalCode += extractFunction("AdminUsers");
finalCode += extractFunction("AdminAchievements");
finalCode += extractFunction("AdminPayments");
finalCode += extractFunction("AdminRequests");
finalCode += extractFunction("CoinValuesEditor");
finalCode += extractFunction("AdsRewardsEditor");
finalCode += extractFunction("FeatureTogglesEditor");

fs.writeFileSync('src/pages/Admin_new.tsx', finalCode);
console.log("Wrote Admin_new.tsx");
