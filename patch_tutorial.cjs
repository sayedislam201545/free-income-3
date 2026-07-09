const fs = require('fs');
let code = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

code = code.replace(
  /onClick=\{\(\) => window\.open\(task\.youtubeUrl \|\| "https:\/\/youtube\.com", "_blank"\)\}/g,
  `onClick={() => {
                const url = task.youtubeUrl || "https://youtube.com";
                if (window.Telegram?.WebApp?.openLink) {
                  window.Telegram.WebApp.openLink(url);
                } else {
                  window.open(url, "_blank");
                }
              }}`
);

fs.writeFileSync('src/pages/TaskDetail.tsx', code);
