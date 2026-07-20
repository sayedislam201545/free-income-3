const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_clean.tsx', 'utf8');

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
    
    // Find the opening brace of the function body!
    let bodyStart = code.indexOf('{', start);
    
    // Wait, the arguments might have braces, e.g. ({ a, b }: any).
    // Let's just find the closing parenthesis of the arguments and the next brace.
    let parenCount = 0;
    let foundParen = false;
    let i = start;
    for (; i < code.length; i++) {
        if (code[i] === '(') { parenCount++; foundParen = true; }
        else if (code[i] === ')') {
            parenCount--;
            if (foundParen && parenCount === 0) {
                break;
            }
        }
    }
    
    bodyStart = code.indexOf('{', i);

    let openBraces = 0;
    let end = -1;
    for (let j = bodyStart; j < code.length; j++) {
        if (code[j] === '{') {
            openBraces++;
        } else if (code[j] === '}') {
            openBraces--;
            if (openBraces === 0) {
                end = j;
                break;
            }
        }
    }
    
    if (end !== -1) {
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

fs.writeFileSync('src/pages/Admin_new2.tsx', finalCode);
console.log("Wrote Admin_new2.tsx");
