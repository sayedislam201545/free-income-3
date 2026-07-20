const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const badIndex = code.indexOf('} from "react";');
if (badIndex !== -1) {
    code = code.substring(0, badIndex + 1); // Keep `}`
}

fs.writeFileSync('src/pages/Admin.tsx', code);
