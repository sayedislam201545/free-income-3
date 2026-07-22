const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// replace values.normal?.adsLimit || 10 with values.normal?.adsLimit ?? 10
code = code.replace(/values\.normal\?\.adsLimit \|\| 10/g, 'values.normal?.adsLimit ?? 10');
code = code.replace(/values\.normal\?\.reward \|\| 1/g, 'values.normal?.reward ?? 1');
code = code.replace(/values\.vip\?\.adsLimit \|\| 20/g, 'values.vip?.adsLimit ?? 20');
code = code.replace(/values\.vip\?\.reward \|\| 2/g, 'values.vip?.reward ?? 2');
code = code.replace(/values\.settings\?\.adsSecond \|\| 10/g, 'values.settings?.adsSecond ?? 10');
code = code.replace(/values\.settings\?\.dailyBonus \|\| 100/g, 'values.settings?.dailyBonus ?? 100');
code = code.replace(/values\.settings\?\.miningRate \|\| 50/g, 'values.settings?.miningRate ?? 50');

// replace parseInt(e.target.value) || 0 with parseInt(e.target.value) || 0 is fine, but maybe if NaN it should be 0.
// But better to use: Number(e.target.value)

code = code.replace(/parseInt\(e\.target\.value\) \|\| 0/g, 'parseInt(e.target.value) || 0');

fs.writeFileSync('src/pages/Admin.tsx', code);
