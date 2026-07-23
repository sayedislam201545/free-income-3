const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /function CoinValuesEditor\(\{[^\}]*\}\) \{[\s\S]*?(?=function AdsRewardsEditor)/;
code = code.replace(regex, '');

// Also remove the rendering block
const renderRegex = /if \(editing === "coin_values"\) \{[\s\S]*?\}\s*\}[\s\S]*?(?=if \(editing === "developer_profile"\))/;
code = code.replace(renderRegex, '');

fs.writeFileSync('src/pages/Admin.tsx', code);
