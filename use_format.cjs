const fs = require('fs');

const formatFn = `import { formatNumber } from "../lib/utils";`;

function patchFile(file) {
  let code = fs.readFileSync(file, 'utf8');
  if (code.includes('user.vaBalance') && !code.includes('formatNumber')) {
      code = code.replace(/\{user\?\.vaBalance \|\| 0\}/g, '{formatNumber(user?.vaBalance || 0)}');
      code = code.replace(/\{user\.vaBalance \|\| 0\}/g, '{formatNumber(user.vaBalance || 0)}');
      
      const imports = code.match(/import .*?;/g);
      if (imports) {
          const lastImport = imports[imports.length - 1];
          code = code.replace(lastImport, lastImport + '\n' + formatFn);
      }
      fs.writeFileSync(file, code);
      console.log("Patched", file);
  }
}

['src/pages/Dashboard.tsx', 'src/pages/Wallet.tsx', 'src/pages/Profile.tsx'].forEach(patchFile);
