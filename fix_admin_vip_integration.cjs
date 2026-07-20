const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /if \(editing === "vip_plan"\) \{[\s\S]*?\}\s*if \(editing === "feature_toggles"\) \{/;
const newCode = `if (editing === "vip_plan") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">VIP Plan Management</h2>
          </div>
          <AdminVIP />
        </div>
      );
    }
    
    if (editing === "feature_toggles") {`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/pages/Admin.tsx', code);
