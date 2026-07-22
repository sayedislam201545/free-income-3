const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

if (!code.includes('formatShortNumber')) {
  code = code.replace(/import \{ Search, Medal, Trophy, Activity, Users, Star \} from "lucide-react";/g, 'import { Search, Medal, Trophy, Activity, Users, Star } from "lucide-react";\\nimport { formatShortNumber } from "../lib/utils";');
}

code = code.replace(/\{activeTab === 'refer' \? user\.score : user\.score\.toLocaleString\(\)\}/g, "{activeTab === 'refer' ? user.score : formatShortNumber(user.score)}");
code = code.replace(/\{activeTab === 'refer' \? user\.score\.toLocaleString\(\) : user\.score\.toLocaleString\(\)\}/g, "{activeTab === 'refer' ? user.score : formatShortNumber(user.score)}");
// Also check if there's any other toLocaleString
code = code.replace(/\{user\.score\.toLocaleString\(\)\}/g, "{activeTab === 'refer' ? user.score : formatShortNumber(user.score)}");

fs.writeFileSync('src/pages/Leaderboard.tsx', code);
console.log("Leaderboard fixed");
