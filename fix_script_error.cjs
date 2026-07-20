const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

if (!indexHtml.includes('e.message === "Script error."')) {
    indexHtml = indexHtml.replace("e.message.includes('WebAppMethodUnsupported')))", "e.message.includes('WebAppMethodUnsupported') || e.message === 'Script error.'))");
    fs.writeFileSync('index.html', indexHtml);
    console.log('Fixed script error handler');
}
