const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

code = code.replace(/includes\('CloudStorage is not supported'\)/g, "includes('CloudStorage is not supported') || (typeof args !== 'undefined' && args.length > 0 && typeof args[0] === 'string' && args[0].includes('WebAppMethodUnsupported')) || (e && e.message && e.message.includes('WebAppMethodUnsupported')) || (e && typeof e.reason === 'string' && e.reason.includes('WebAppMethodUnsupported'))");

fs.writeFileSync('index.html', code);
console.log("updated");
