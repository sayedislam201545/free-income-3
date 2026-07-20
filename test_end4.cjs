const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const badIndex = code.indexOf('  );\n} from "react";');
console.log("badIndex:", badIndex);
