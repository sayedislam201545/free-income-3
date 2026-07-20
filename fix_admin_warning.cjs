const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `{
            label: "Bot Setting",
            key: "feature_toggles",
            desc: "Enable or disable system features",
            icon: "⚙️",
            label: "Feature Toggles",
          },
          {
            key: "bot_setting",
            desc: "Configure telegram bot integration",
            icon: "🤖",
          },`;

const replacement = `{
            label: "Feature Toggles",
            key: "feature_toggles",
            desc: "Enable or disable system features",
            icon: "⚙️",
          },
          {
            label: "Bot Setting",
            key: "bot_setting",
            desc: "Configure telegram bot integration",
            icon: "🤖",
          },`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Admin.tsx', code);
