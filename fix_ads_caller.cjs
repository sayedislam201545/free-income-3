const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace state
code = code.replace(/const \[adsConfig, setAdsConfig\] = useState<any>\(\{\}\);\n  const \[rewardsConfig, setRewardsConfig\] = useState<any>\(\{\}\);/, 
  'const [adsRewardsData, setAdsRewardsData] = useState<any>({});');

// Replace loading
code = code.replace(/setAdsConfig\(adsSnap\.data\(\)\.ads \|\| \{\}\);\n          setRewardsConfig\(adsSnap\.data\(\)\.rewards \|\| \{\}\);/, 
  'setAdsRewardsData(adsSnap.data() || {});');

// Replace caller
code = code.replace(/<AdsRewardsEditor onClose=\{\(\) => setEditing\(null\)\} initialAdsConfig=\{adsConfig\} initialRewardsConfig=\{rewardsConfig\}/, 
  '<AdsRewardsEditor onClose={() => setEditing(null)} initialValues={adsRewardsData}');

fs.writeFileSync('src/pages/Admin.tsx', code);
