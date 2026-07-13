const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace(/  \/\/ Referral Modal States[\s\S]*?const slides = \[/m, "  const slides = [");
code = code.replace(/<AnimatePresence>\s*\{showLoader[\s\S]*?<\/AnimatePresence>\s*<\/div>\s*<\/div>\s*\);/m, "</div>\n  );\n");
code = code.replace(/<AnimatePresence>\s*\{showLoader && <FootballLoader[\s\S]*?<\/AnimatePresence>/m, "");
code = code.replace(/import FootballLoader from "\.\.\/components\/FootballLoader";\n/m, "");

fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log("Dashboard updated successfully");
