const fs = require('fs');

let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');
code = code.replace(/b => b\.active/g, 'b => b?.active');
fs.writeFileSync('src/pages/Ads.tsx', code);
