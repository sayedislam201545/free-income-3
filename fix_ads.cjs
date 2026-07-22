const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Change the caller to pass initialValues instead of initialAdsConfig / initialRewardsConfig
code = code.replace(/<AdsRewardsEditor onClose=\{\(\) => setEditing\(null\)\} initialAdsConfig=\{adsConfig\} initialRewardsConfig=\{rewardsConfig\} onSave=\{async \(vals: any\) => \{/g,
  '<AdsRewardsEditor onClose={() => setEditing(null)} initialValues={siteConfig} onSave={async (vals: any) => {');

// wait, is siteConfig available? Let's check what state we have in AdminSettings
