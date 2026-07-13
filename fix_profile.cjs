const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

if (!code.includes('Check,')) {
    code = code.replace("  User,", "  User,\n  Check,");
}
fs.writeFileSync('src/pages/Profile.tsx', code);
