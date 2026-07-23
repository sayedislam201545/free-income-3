const fs = require('fs');

function fixAds() {
  let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');
  
  // Replace fallback 50 with 10 for normal users, or handle it smartly
  code = code.replace(/specificConfig\.adsLimit !== undefined \? specificConfig\.adsLimit : 50/g, 'specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : (isVipUser ? 20 : 10)');
  code = code.replace(/dailyAdsLimit: 50/g, 'dailyAdsLimit: (isVipUser ? 20 : 10)');
  
  // limit is read from adsConfig
  code = code.replace(/const limit = adsConfig\.dailyAdsLimit !== undefined \? adsConfig\.dailyAdsLimit : 50;/g, 'const limit = adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10);');

  fs.writeFileSync('src/pages/Ads.tsx', code);
}

function fixAdDetail() {
  let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');
  
  code = code.replace(/specificConfig\.adsLimit !== undefined \? specificConfig\.adsLimit : 50/g, 'specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : (isVipUser ? 20 : 10)');
  code = code.replace(/dailyAdsLimit: 50/g, 'dailyAdsLimit: (isVipUser ? 20 : 10)');
  
  code = code.replace(/specificConfig\.reward !== undefined \? specificConfig\.reward : 50/g, 'specificConfig.reward !== undefined ? specificConfig.reward : (isVipUser ? 2 : 1)');
  code = code.replace(/rewardPerAd: 50/g, 'rewardPerAd: (isVipUser ? 2 : 1)');

  code = code.replace(/adsConfig\.dailyAdsLimit !== undefined \? adsConfig\.dailyAdsLimit : 50/g, 'adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10)');
  code = code.replace(/adsConfig\.dailyAdsLimit \|\| 50/g, 'adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10)');
  
  code = code.replace(/adsConfig\.rewardPerAd !== undefined \? adsConfig\.rewardPerAd : 50/g, 'adsConfig.rewardPerAd !== undefined ? adsConfig.rewardPerAd : (isVipUser ? 2 : 1)');
  code = code.replace(/adsConfig\.rewardPerAd \|\| 50/g, 'adsConfig.rewardPerAd !== undefined ? adsConfig.rewardPerAd : (isVipUser ? 2 : 1)');
  
  fs.writeFileSync('src/pages/AdDetail.tsx', code);
}

fixAds();
fixAdDetail();
