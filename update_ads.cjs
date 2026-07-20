const fs = require('fs');

function fixVipCheck(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Change user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now()
    // To just user?.isVip === true
    content = content.replace(/user\?\.isVip && user\?\.vipExpiry && user\?\.vipExpiry > Date\.now\(\)/g, "user?.isVip === true");
    content = content.replace(/uData\.isVip && uData\.vipExpiry && uData\.vipExpiry > Date\.now\(\)/g, "uData.isVip === true");
    fs.writeFileSync(filePath, content);
    console.log('Fixed VIP check in', filePath);
}

fixVipCheck('src/pages/Ads.tsx');
fixVipCheck('src/pages/AdDetail.tsx');

let lbTsx = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');
lbTsx = lbTsx.replace(/\.slice\(0, 20\)/g, '.slice(0, 10)');
fs.writeFileSync('src/pages/Leaderboard.tsx', lbTsx);
console.log('Fixed Leaderboard.tsx');
