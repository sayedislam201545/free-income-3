const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

if (!code.includes('formatShortNumber')) {
  code = code.replace(/import \{ formatNumber \} from "\.\.\/lib\/utils";/g, 'import { formatNumber, formatShortNumber } from "../lib/utils";');
  if (!code.includes('formatShortNumber')) {
     code = code.replace(/import \{ db \} from "\.\.\/lib\/firebase";/, 'import { db } from "../lib/firebase";\\nimport { formatNumber, formatShortNumber } from "../lib/utils";');
  }
}

code = code.replace(/realStats\.totalEarned\.toLocaleString\(\)/g, 'formatShortNumber(realStats.totalEarned)');
code = code.replace(/\(user\?\.vaBalance \|\| 0\)\.toLocaleString\(\)/g, 'formatShortNumber(user?.vaBalance || 0)');

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log("Dashboard fixed");
