const fs = require('fs');

function fixAds() {
  let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');
  
  const oldSetSpecific = `if (specificConfig) {
               setAdsConfig({ ...data.settings, ...specificConfig, dailyAdsLimit: specificConfig.adsLimit || 50 });
            } else {
               setAdsConfig({ ...data.settings, dailyAdsLimit: 50 });
            }`;
  const newSetSpecific = `if (specificConfig) {
               setAdsConfig({ ...data.settings, ...specificConfig, dailyAdsLimit: specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : 50 });
            } else {
               setAdsConfig({ ...data.settings, dailyAdsLimit: 50 });
            }`;
  
  code = code.replace(oldSetSpecific, newSetSpecific);
  
  const oldLimit = `const limit = adsConfig.dailyAdsLimit || 50;`;
  const newLimit = `const limit = adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : 50;`;
  code = code.replace(oldLimit, newLimit);
  
  fs.writeFileSync('src/pages/Ads.tsx', code);
}

function fixAdDetail() {
  let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');
  
  const oldSetSpecific = `if (specificConfig) {
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
            }`;
  const newSetSpecific = `if (specificConfig) {
               setAdsConfig({ 
                   ...settings, 
                   ...specificConfig, 
                   adWatchDuration: settings.adsSecond !== undefined ? settings.adsSecond : 15,
                   dailyAdsLimit: specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : 50,
                   rewardPerAd: specificConfig.reward !== undefined ? specificConfig.reward : 50
               });
            } else {
               setAdsConfig({ 
                   ...settings, 
                   adWatchDuration: settings.adsSecond !== undefined ? settings.adsSecond : 15,
                   dailyAdsLimit: 50,
                   rewardPerAd: 50
               });
            }`;
            
  code = code.replace(oldSetSpecific, newSetSpecific);
  
  const oldReward = `const addedCoins = adsConfig.rewardPerAd || 50;`;
  const newReward = `const addedCoins = adsConfig.rewardPerAd !== undefined ? adsConfig.rewardPerAd : 50;`;
  code = code.replace(oldReward, newReward);
  
  const oldDisplayReward = `{adsConfig.rewardPerAd || 50}`;
  const newDisplayReward = `{adsConfig.rewardPerAd !== undefined ? adsConfig.rewardPerAd : 50}`;
  code = code.replace(oldDisplayReward, newDisplayReward);
  
  fs.writeFileSync('src/pages/AdDetail.tsx', code);
}

fixAds();
fixAdDetail();
