const fs = require('fs');
let code = fs.readFileSync('src/lib/utils.ts', 'utf8');

const newFormat = `export function formatShortNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) return '0.00';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
  return num.toFixed(2);
}`;

if (!code.includes('formatShortNumber')) {
    code += '\\n' + newFormat;
    fs.writeFileSync('src/lib/utils.ts', code);
    console.log("Added formatShortNumber");
}
