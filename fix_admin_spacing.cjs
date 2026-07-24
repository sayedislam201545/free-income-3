const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `<div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw Referrals</label>`;

const replacement = `<div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw Referrals</label>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Admin.tsx', code);
