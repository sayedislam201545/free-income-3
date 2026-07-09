const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldStr = `              <p className="text-yellow-400 text-sm font-bold whitespace-nowrap bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                {u.vaBalance || 0} VA
              </p>`;

code = code.replace(oldStr, '');

fs.writeFileSync('src/pages/Admin.tsx', code);
