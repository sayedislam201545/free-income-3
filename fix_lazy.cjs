const fs = require('fs');

// 1. Language title fix
let lang = fs.readFileSync('src/pages/Language.tsx', 'utf8');
lang = lang.replace('<h1 className="text-xl font-bold">Leagues</h1>', '<h1 className="text-xl font-bold">Language</h1>');
fs.writeFileSync('src/pages/Language.tsx', lang);
console.log('Language page fixed.');
