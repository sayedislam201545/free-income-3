const fs = require('fs');
let code = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) =>\s*window\.open\(task\.targetUrl \|\| "https:\/\/t\.me", "_blank"\)\s*\}/g,
  `onClick={() => {
                const url = task.targetUrl || "https://t.me";
                if (window.Telegram?.WebApp?.openLink) {
                  window.Telegram.WebApp.openLink(url);
                } else {
                  window.open(url, "_blank");
                }
              }}`
);

fs.writeFileSync('src/pages/TaskDetail.tsx', code);
