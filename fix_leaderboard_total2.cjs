const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

if (!code.includes('formatShortNumber')) {
  code = code.replace(/import \{ db \} from "\.\.\/lib\/firebase";/, 'import { db } from "../lib/firebase";\nimport { formatShortNumber } from "../lib/utils";');
}

code = code.replace(/<span className="font-bold text-gray-900 font-mono text-sm mr-1">\{user\.score\}<\/span>/, '<span className="font-bold text-gray-900 font-mono text-sm mr-1">{activeTab === \'refer\' ? user.score : formatShortNumber(user.score)}</span>');

fs.writeFileSync('src/pages/Leaderboard.tsx', code);
console.log("Leaderboard score fixed");
