const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /if \(editing === "developer_profile"\) \{[\s\S]*?Save Developer Profile<\/button>\s*<\/div>\s*\);\s*\}/g;

let count = 0;
code = code.replace(regex, (match) => {
    count++;
    if (count === 2) {
        return ""; // remove the duplicate
    }
    return match;
});

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Fixed duplicate Developer Profile");
