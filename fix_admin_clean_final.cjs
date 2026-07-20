const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin_clean.tsx', 'utf8');

// There are string duplications! Let's find the first instance of each function.
const functions = [
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

// Instead of Babel which fails on syntax errors, let's use regex to extract the first occurrence of each function!
const extractedCode = [];

// Get imports
const imports = code.split(/export default function|function AdminDashboard/)[0];
extractedCode.push(imports);

functions.forEach(fn => {
    let regex;
    if (fn === "AdminLayout") {
        regex = new RegExp(`export default function AdminLayout\\(\\) \\{[\\s\\S]*?(?=function AdminDashboard)`);
    } else {
        const nextFnIndex = functions.indexOf(fn) + 1;
        if (nextFnIndex < functions.length) {
            const nextFn = functions[nextFnIndex];
            regex = new RegExp(`function ${fn}\\([\\s\\S]*?(?=function ${nextFn})`);
        } else {
            // For the last function, just extract until the end of its first block.
            // Since FeatureTogglesEditor is the last one, let's just grab it until the end of the file.
            regex = new RegExp(`function ${fn}\\([\\s\\S]*$`);
        }
    }
    
    const match = code.match(regex);
    if (match) {
        let text = match[0];
        
        // Let's clean up the text if it contains duplicated sub-blocks!
        // AdminSettings has a known duplication/syntax error around "bot_setting".
        if (fn === 'AdminSettings') {
            // Fix the syntax error in AdminSettings
            // The syntax error is:
            /*
                if (editing === "vip_plan") {
                }
              return (
            */
            // Let's just find `if (editing === "vip_plan") {` and fix it.
            // It looks like it was cut off.
            // Wait, I can just use Admin_current.tsx's AdminSettings! It's already deduplicated and syntactically correct!
        }
        
        extractedCode.push(text);
    }
});

// Write it to a file
fs.writeFileSync('src/pages/Admin_recovered.tsx', extractedCode.join('\n\n'));
console.log("Extraction done");
