const fs = require('fs');

function fixAds() {
  let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');
  code = code.replace(/const isVipUser = user\?\.isVip === true;/, 'const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();');
  code = code.replace(/\}, \[\]\);/g, '}, [isVipUser]);');
  fs.writeFileSync('src/pages/Ads.tsx', code);
}

function fixAdDetail() {
  let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');
  code = code.replace(/const isVipUser = user\?\.isVip === true;/, 'const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();');
  fs.writeFileSync('src/pages/AdDetail.tsx', code);
}

fixAds();
fixAdDetail();
