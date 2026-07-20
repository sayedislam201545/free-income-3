const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /  \);\n\} from "react";\nimport \{ Routes/g;
const matches = [...code.matchAll(regex)];

console.log("Found matches:", matches.length);
