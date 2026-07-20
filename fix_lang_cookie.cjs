const fs = require('fs');
let code = fs.readFileSync('src/pages/Language.tsx', 'utf8');

code = code.replace(
    "document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname};`;",
    "document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname};`;"
);

fs.writeFileSync('src/pages/Language.tsx', code);
