const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetRegex = /<script>\s*const originalConsoleError = console\.error;[\s\S]*?<\/script>/;

const replacement = `<script>
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      
      function shouldSuppress(args) {
          for (let i = 0; i < args.length; i++) {
              if (typeof args[i] === 'string' && (args[i].includes('CloudStorage is not supported') || args[i].includes('WebAppMethodUnsupported'))) {
                  return true;
              }
          }
          if (args.length > 0 && args[0] && args[0].message && args[0].message.includes('WebAppMethodUnsupported')) {
              return true;
          }
          return false;
      }

      console.error = function() {
        if (shouldSuppress(arguments)) return;
        originalConsoleError.apply(console, arguments);
      };
      console.warn = function() {
        if (shouldSuppress(arguments)) return;
        originalConsoleWarn.apply(console, arguments);
      };
      
      window.addEventListener('error', function(e) {
          if ((e.message && (e.message.includes('CloudStorage is not supported') || e.message.includes('WebAppMethodUnsupported'))) || (e.error && e.error.message && e.error.message.includes('WebAppMethodUnsupported'))) {
              e.preventDefault();
              e.stopImmediatePropagation();
          }
      });
      window.addEventListener('unhandledrejection', function(e) {
          if (e.reason && typeof e.reason === 'string' && (e.reason.includes('CloudStorage is not supported') || e.reason.includes('WebAppMethodUnsupported'))) {
              e.preventDefault();
              e.stopImmediatePropagation();
          } else if (e.reason && e.reason.message && e.reason.message.includes('WebAppMethodUnsupported')) {
              e.preventDefault();
              e.stopImmediatePropagation();
          }
      });
    </script>`;

code = code.replace(targetRegex, replacement);
fs.writeFileSync('index.html', code);
console.log("Updated cleanly.");
