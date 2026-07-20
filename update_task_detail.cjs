const fs = require('fs');
let content = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

// The line is: const imgbbToken = botSettingSnap.exists() ? botSettingSnap.data().imgbbApiToken : null;
// We changed Admin.tsx to use imgbbApiToken, so it should be fine. But just in case:
content = content.replace('botSettingSnap.data().imgbbApiToken', 'botSettingSnap.data().imgbbApiToken || botSettingSnap.data().imgbbApi');

fs.writeFileSync('src/pages/TaskDetail.tsx', content);
