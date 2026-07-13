const fs = require('fs');
let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

code = code.replace("        )}\\n        )}", "        )}");
code = code.replace("        )}\n        )}", "        )}");

fs.writeFileSync('src/pages/Refer.tsx', code);
