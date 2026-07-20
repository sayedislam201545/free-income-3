const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

// There are two "Language" labels in the array. Let's remove the second one.
const arrStr = code.match(/\{[\s\S]*?label: "Language"[\s\S]*?\}/g);
if (arrStr && arrStr.length > 1) {
    code = code.replace(arrStr[1] + ',', '');
}
fs.writeFileSync('src/pages/Profile.tsx', code);
