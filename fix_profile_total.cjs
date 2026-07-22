const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

if (!code.includes('formatShortNumber')) {
  code = code.replace(/import \{ formatNumber \} from "\.\.\/lib\/utils";/g, 'import { formatNumber, formatShortNumber } from "../lib/utils";');
  if (!code.includes('formatShortNumber')) {
     code = code.replace(/import \{ db \} from "\.\.\/lib\/firebase";/, 'import { db } from "../lib/firebase";\\nimport { formatNumber, formatShortNumber } from "../lib/utils";');
  }
}

code = code.replace(/\{\(displayUser\.vaBalance \|\| 0\)\.toLocaleString\(\)\}/g, '{formatShortNumber(displayUser.vaBalance || 0)}');

fs.writeFileSync('src/pages/Profile.tsx', code);
console.log("Profile fixed");
