const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const importMatch = code.match(/import \{([^}]+)\} from "lucide-react";/);
if (importMatch) {
    let imports = importMatch[1].split(',').map(s => s.trim());
    if (!imports.includes('Coins')) imports.push('Coins');
    if (!imports.includes('User')) imports.push('User');
    code = code.replace(importMatch[0], `import { ${imports.join(', ')} } from "lucide-react";`);
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Imports fixed");
}
