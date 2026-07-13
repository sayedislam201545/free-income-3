const fs = require('fs');
let code = fs.readFileSync('src/lib/monetag.ts', 'utf8');
code = code.replace(
  'let script = document.querySelector(`script[data-zone="${zoneId}"]`);',
  'let script = document.querySelector(`script[data-zone="${zoneId}"]`) as HTMLScriptElement | null;'
);
fs.writeFileSync('src/lib/monetag.ts', code);
