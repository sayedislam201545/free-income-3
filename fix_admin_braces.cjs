const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace(/    <\/div>\n  \);\n\}\n\}\n\}\n\}\n\}/g, '    </div>\n  );\n}');
fs.writeFileSync('src/pages/Admin.tsx', code);
