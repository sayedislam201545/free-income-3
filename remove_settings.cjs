const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/\{ title: "Privacy Policy".*?\}\,/, '');
code = code.replace(/\{ title: "Terms & Conditions".*?\}\,/, '');
code = code.replace(/\{ title: "About Us".*?\}\,/, '');

fs.writeFileSync('src/pages/Admin.tsx', code);
