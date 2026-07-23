const fs = require('fs');
let code = fs.readFileSync('src/main.tsx', 'utf8');
code = code.replace("import App from './App.tsx';", "import App from './App.tsx';\nimport './lib/i18n';");
fs.writeFileSync('src/main.tsx', code);
