const fs = require('fs');

function extractFunction(file, name) {
    const code = fs.readFileSync(file, 'utf8');
    const startIdx = code.indexOf(`function ${name}() {`);
    if (startIdx === -1) return "NOT FOUND";
    
    // find matching brace
    let braces = 0;
    let idx = startIdx + `function ${name}() {`.length;
    braces++;
    
    while (braces > 0 && idx < code.length) {
        if (code[idx] === '{') braces++;
        else if (code[idx] === '}') braces--;
        idx++;
    }
    return code.slice(startIdx, idx);
}

const clean = extractFunction('src/pages/Admin_clean.tsx', 'AdminDashboard');
const current = extractFunction('src/pages/Admin_current.tsx', 'AdminDashboard');

console.log("Length in Admin_clean:", clean.length);
console.log("Length in Admin_current:", current.length);

const cleanS = extractFunction('src/pages/Admin_clean.tsx', 'AdminSettings');
const currentS = extractFunction('src/pages/Admin_current.tsx', 'AdminSettings');
console.log("AdminSettings Length in Admin_clean:", cleanS.length);
console.log("AdminSettings Length in Admin_current:", currentS.length);

