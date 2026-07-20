const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// There are duplicates in the file. Let's find exactly what happened.
console.log(code.length);
