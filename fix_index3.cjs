const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const replacement = `<script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
      // Mock CloudStorage methods to prevent errors from third-party scripts
      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.CloudStorage) {
          const fakeMethod = function() {
              const callback = arguments[arguments.length - 1];
              if (typeof callback === 'function') {
                  callback(null, null);
              } else if (typeof callback === 'undefined' && arguments.length > 0 && typeof arguments[arguments.length - 2] === 'function') {
                  arguments[arguments.length - 2](null, null);
              }
          };
          window.Telegram.WebApp.CloudStorage.setItem = fakeMethod;
          window.Telegram.WebApp.CloudStorage.getItem = fakeMethod;
          window.Telegram.WebApp.CloudStorage.getItems = fakeMethod;
          window.Telegram.WebApp.CloudStorage.removeItem = fakeMethod;
          window.Telegram.WebApp.CloudStorage.removeItems = fakeMethod;
          window.Telegram.WebApp.CloudStorage.getKeys = fakeMethod;
      }
    </script>`;

// replace my old script block with the new one
code = code.replace(/<script src="https:\/\/telegram\.org\/js\/telegram-web-app\.js"><\/script>\s*<script>\s*\/\/ Mock CloudStorage[^]*?<\/script>/, replacement);

fs.writeFileSync('index.html', code);
console.log("Updated index.html");
