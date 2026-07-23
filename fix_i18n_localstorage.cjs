const fs = require('fs');

let code = fs.readFileSync('src/lib/i18n.ts', 'utf8');
code = code.replace("lng: 'en', // default language", "lng: localStorage.getItem('app_language') || 'en', // default language");
fs.writeFileSync('src/lib/i18n.ts', code);
