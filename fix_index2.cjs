const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const targetScript = `<script src="https://telegram.org/js/telegram-web-app.js"></script>`;

const replacement = `<script src="https://telegram.org/js/telegram-web-app.js"></script>
    <script>
      // Mock CloudStorage to prevent errors from third-party scripts
      if (window.Telegram && window.Telegram.WebApp) {
          const fakeMethod = function() {
              const callback = arguments[arguments.length - 1];
              if (typeof callback === 'function') {
                  callback(null, null);
              }
          };
          window.Telegram.WebApp.CloudStorage = {
              setItem: fakeMethod,
              getItem: fakeMethod,
              getItems: fakeMethod,
              removeItem: fakeMethod,
              removeItems: fakeMethod,
              getKeys: fakeMethod
          };
      }
    </script>`;

code = code.replace(targetScript, replacement);
fs.writeFileSync('index.html', code);
console.log("updated");
