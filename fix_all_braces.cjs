const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// The file has some number of open braces. Let's just find out how many are open overall at the end of the file.
let open = 0;
for (let char of code) {
    if (char === '{') open++;
    if (char === '}') open--;
}
console.log("Total unclosed braces in file:", open);

// Since FeatureTogglesEditor is fully balanced inside itself, the unclosed braces must be placed right before it!
let fIndex = code.indexOf('function FeatureTogglesEditor');
if (fIndex !== -1 && open > 0) {
    let before = code.substring(0, fIndex);
    let after = code.substring(fIndex);
    let braces = '';
    for (let i = 0; i < open; i++) braces += '}\n';
    code = before + '\n' + braces + '\n' + after;
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Fixed by adding " + open + " braces.");
} else if (open > 0) {
    let braces = '';
    for (let i = 0; i < open; i++) braces += '}\n';
    code += '\n' + braces;
    fs.writeFileSync('src/pages/Admin.tsx', code);
}
