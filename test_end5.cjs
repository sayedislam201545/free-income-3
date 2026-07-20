const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Find the string ` from "react";` and print the 20 chars before it
const idx = code.indexOf(' from "react";');
if (idx !== -1) {
    console.log(code.substring(idx - 20, idx + 20));
}
