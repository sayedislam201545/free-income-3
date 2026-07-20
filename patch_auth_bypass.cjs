const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  'if (!user) {',
  'if (!user && window.location.pathname !== "/admin") {'
);
fs.writeFileSync('src/App.tsx', code);
