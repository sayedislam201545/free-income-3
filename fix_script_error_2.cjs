const fs = require('fs');
let indexHtml = fs.readFileSync('index.html', 'utf8');

if (!indexHtml.includes("window.addEventListener('error', function(e) {\\n          if (e.message === 'Script error.')")) {
    indexHtml = indexHtml.replace("window.addEventListener('error', function(e) {", 
    `window.addEventListener('error', function(e) {
          if (e.message === 'Script error.') {
              e.preventDefault();
              e.stopImmediatePropagation();
              return true;
          }`);
    fs.writeFileSync('index.html', indexHtml);
    console.log('Fixed script error handler thoroughly');
}
