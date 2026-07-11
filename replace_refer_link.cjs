const fs = require('fs');
let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

const target1 = `             onClick={() => botSetting?.referralHowItWorksLink ? window.open(botSetting.referralHowItWorksLink, '_blank') : null}`;
const replacement1 = `             onClick={() => {
                 if (botSetting?.referralHowItWorksLink) {
                     if ((window as any).Telegram?.WebApp) {
                         (window as any).Telegram.WebApp.openLink(botSetting.referralHowItWorksLink);
                     } else {
                         window.open(botSetting.referralHowItWorksLink, '_blank');
                     }
                 }
             }}`;

code = code.replaceAll(target1, replacement1);
fs.writeFileSync('src/pages/Refer.tsx', code);
