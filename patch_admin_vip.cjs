const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /if \(editing === "vip_plan"\) \{[\s\S]*?<\/div>\s*\);\s*\}/;

const newVip = `if (editing === "vip_plan") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <AdminVIP />
        </div>
      );
    }`;

if(code.match(regex)) {
    code = code.replace(regex, newVip);
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Admin VIP Plan patched");
}
