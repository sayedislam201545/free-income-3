const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin_clean.tsx', 'utf8');

const babel = require('@babel/parser');
try {
    const ast = babel.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });
    console.log("Admin_clean parsed successfully!");
} catch (e) {
    console.log("Admin_clean failed to parse:", e.message);
}
