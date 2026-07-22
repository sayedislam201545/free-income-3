const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/setNewBalance\(u\.vaBalance\?\.toString\(\) \|\| "0"\)/g, 'setNewBalance(u.vaBalance && !isNaN(u.vaBalance) ? String(u.vaBalance) : "0")');
code = code.replace(/value=\{String\(newBalance\)\}/g, 'value={newBalance === "NaN" ? "" : newBalance}');

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Fixed NaN string");
