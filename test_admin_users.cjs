const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const getFullNameRegex = /const getFullName = \(u: any\) => \{[\s\S]*?\};/;
const newGetFullName = `const getFullName = (u: any) => {
    if (u.fullName) return u.fullName;
    const name = \\\`\\\${u.firstName || u.first_name || ''} \\\${u.lastName || u.last_name || ''}\\\`.trim();
    return name || u.name || "Unknown";
  };`;

code = code.replace(getFullNameRegex, newGetFullName);

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Admin Users fullName fixed");
