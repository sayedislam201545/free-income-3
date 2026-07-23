const fs = require('fs');

let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');
code = code.replace(/const \[adsConfig, setAdsConfig\] = useState<any>\(\{ dailyAdsLimit: \(isVipUser \? 20 : 10\) \}\);\s*const isVipUser = user\?\.isVip && user\?\.vipExpiry && user\?\.vipExpiry > Date\.now\(\);/, 
`const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
  const [adsConfig, setAdsConfig] = useState<any>({ dailyAdsLimit: (isVipUser ? 20 : 10) });`);
fs.writeFileSync('src/pages/Ads.tsx', code);

code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');
code = code.replace(/const \[adsConfig, setAdsConfig\] = useState<any>\(\{[\s\S]*?\}\);\s*const user = useAuthStore\(\(state\) => state\.user\);\s*const isVipUser = user\?\.isVip && user\?\.vipExpiry && user\?\.vipExpiry > Date\.now\(\);/, 
`const user = useAuthStore((state) => state.user);
  const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
  const [adsConfig, setAdsConfig] = useState<any>({
    dailyAdsLimit: (isVipUser ? 20 : 10),
    adWatchDuration: 15,
    rewardPerAd: (isVipUser ? 2 : 1),
  });`);
fs.writeFileSync('src/pages/AdDetail.tsx', code);

