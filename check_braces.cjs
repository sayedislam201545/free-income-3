const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
let fIndex = code.indexOf('function FeatureTogglesEditor');

let portion = code.substring(0, fIndex);
let open = 0;
for (let char of portion) {
    if (char === '{') open++;
    if (char === '}') open--;
}
console.log("Unclosed braces:", open);
