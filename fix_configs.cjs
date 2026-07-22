const fs = require('fs');

const updateFile = (filename, replacer) => {
    let code = fs.readFileSync(filename, 'utf8');
    code = replacer(code);
    fs.writeFileSync(filename, code);
}

// Ads.tsx
updateFile('src/pages/Ads.tsx', code => {
    code = code.replace(/"settings", "ads_config"/g, '"settings", "ads_rewards_config"');
    code = code.replace(/const specificConfig = isVipUser \? data\.vipUser : data\.normalUser;/g, 'const specificConfig = isVipUser ? data.vip : data.normal;');
    return code;
});

// AdDetail.tsx
updateFile('src/pages/AdDetail.tsx', code => {
    code = code.replace(/"settings", "ads_config"/g, '"settings", "ads_rewards_config"');
    code = code.replace(/const specificConfig = isVip \? data\.vipUser : data\.normalUser;/g, 'const specificConfig = isVip ? data.vip : data.normal;');
    // also update waiting time if it was hardcoded or came from adsSecond
    // adsSecond logic might need to be passed down or handled.
    return code;
});

// Let's see CheckIn.tsx
// if CheckIn.tsx reads settings, we'll see
