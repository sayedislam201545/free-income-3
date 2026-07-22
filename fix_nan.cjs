const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// replace value={newBalance} with value={String(newBalance)}
code = code.replace(/value=\{newBalance\}/g, 'value={String(newBalance)}');

// fix parsing in AdsRewardsEditor and CoinValuesEditor
code = code.replace(/parseFloat\(e\.target\.value\)/g, 'parseFloat(e.target.value) || 0');
code = code.replace(/parseInt\(e\.target\.value\)/g, 'parseInt(e.target.value) || 0');

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Fixed NaN and parsing");
