const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace(
  "const originalConsoleError = console.error;",
  "const originalConsoleError = console.error;\n      const originalConsoleWarn = console.warn;"
);
code = code.replace(
  "originalConsoleError.apply(console, arguments);",
  "originalConsoleError.apply(console, arguments);\n      };\n      console.warn = function() {\n        if (arguments[0] && typeof arguments[0] === 'string' && arguments[0].includes('CloudStorage is not supported')) {\n          return;\n        }\n        originalConsoleWarn.apply(console, arguments);"
);
fs.writeFileSync('index.html', code);
