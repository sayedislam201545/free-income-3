const fs = require('fs');
let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');
code = code.replace(/const \[adsConfig, setAdsConfig\] = useState<any>\(\{ dailyAdsLimit: \(isVipUser \? 20 : 10\) \}\);\n  const isVipUser = user\?\.isVip && user\?\.vipExpiry && user\?\.vipExpiry > Date\.now\(\);/, 
`const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
  const [adsConfig, setAdsConfig] = useState<any>({ dailyAdsLimit: (isVipUser ? 20 : 10) });`);
fs.writeFileSync('src/pages/Ads.tsx', code);
