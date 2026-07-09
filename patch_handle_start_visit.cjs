const fs = require('fs');
let code = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

code = code.replace(
  /window\.open\(task\?\.targetUrl \|\| "https:\/\/google\.com", "_blank"\);/,
  `const url = task?.targetUrl || "https://google.com";
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url);
    } else {
      window.open(url, "_blank");
    }`
);

fs.writeFileSync('src/pages/TaskDetail.tsx', code);
