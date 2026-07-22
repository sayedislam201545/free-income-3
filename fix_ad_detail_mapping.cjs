const fs = require('fs');
let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

code = code.replace(/if \(specificConfig\) \{\n             setAdsConfig\(\{ \.\.\.settings, \.\.\.specificConfig, adWatchDuration: settings\.adsSecond \|\| 15 \}\);\n          \} else \{\n             setAdsConfig\(\{ \.\.\.settings, adWatchDuration: settings\.adsSecond \|\| 15 \}\);\n          \}/g,
`if (specificConfig) {
             setAdsConfig({ 
                 ...settings, 
                 ...specificConfig, 
                 adWatchDuration: settings.adsSecond || 15,
                 dailyAdsLimit: specificConfig.adsLimit || 50,
                 rewardPerAd: specificConfig.reward || 50
             });
          } else {
             setAdsConfig({ 
                 ...settings, 
                 adWatchDuration: settings.adsSecond || 15,
                 dailyAdsLimit: 50,
                 rewardPerAd: 50
             });
          }`);

fs.writeFileSync('src/pages/AdDetail.tsx', code);
