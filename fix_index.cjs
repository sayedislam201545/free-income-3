const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetScript = `<script>
      const originalConsoleError = console.error;
      const originalConsoleWarn = console.warn;
      
      function shouldSuppress(args) {
          for (let i = 0; i < args.length; i++) {
              if (typeof args[i] === 'string' && args[i].includes('CloudStorage is not supported')) {
                  return true;
              }
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
          if (e.message && e.message.includes('CloudStorage is not supported')) {
              e.stopImmediatePropagation();
          }
      });
      window.addEventListener('unhandledrejection', function(e) {
          if (e.reason && typeof e.reason === 'string' && e.reason.includes('CloudStorage is not supported')) {
              e.stopImmediatePropagation();
          }
      });
    </script>`;

code = code.replace(targetScript, "");

// Insert before the telegram script
code = code.replace('<script src="https://telegram.org/js/telegram-web-app.js"></script>', targetScript + '\n    <script src="https://telegram.org/js/telegram-web-app.js"></script>');

fs.writeFileSync('index.html', code);
