const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const idx = code.indexOf(' from "react";', 500);
if (idx !== -1) {
    console.log(code.substring(idx - 20, idx + 20));
}
