const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

code = code.replace(/label: "Leagues",\s+icon: Globe,/g, 'label: "Leagues",\n              icon: Trophy,');
fs.writeFileSync('src/pages/Profile.tsx', code);
