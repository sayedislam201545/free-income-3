const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!code.includes('formatShortNumber')) {
  code = code.replace(/import \{ formatNumber \} from "\.\.\/lib\/utils";/g, 'import { formatNumber, formatShortNumber } from "../lib/utils";');
  if (!code.includes('formatShortNumber')) {
     code = code.replace(/import \{ jsPDF \} from "jspdf";/, 'import { jsPDF } from "jspdf";\\nimport { formatNumber, formatShortNumber } from "../lib/utils";');
  }
}

code = code.replace(/stats\.totalCoins\.toLocaleString\(\)/g, 'formatShortNumber(stats.totalCoins)');

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Admin total fixed");
