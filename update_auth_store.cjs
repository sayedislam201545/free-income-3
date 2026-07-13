const fs = require('fs');
let code = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

const targetUser = `  referredBy?: string;`;
const replacementUser = `  referredBy?: string;
  walletPassword?: string;
  accountPassword?: string;`;

if(code.includes(targetUser)) {
    code = code.replace(targetUser, replacementUser);
    fs.writeFileSync('src/store/useAuthStore.ts', code);
    console.log("AuthStore updated");
}
