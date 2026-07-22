const fs = require('fs');

let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');
code = code.replace(/dailyWatched >= \(adsConfig\.dailyAdsLimit \|\| 50\)/g, 'dailyWatched >= (adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : 50)');
fs.writeFileSync('src/pages/AdDetail.tsx', code);
