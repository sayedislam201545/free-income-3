const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const search = `      );
    }
    if (editing === "ads_rewards_config") {
    }
  return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">`;
        
const replace = `      );
    }
    if (editing === "developer_profile") {`;
    
const blockStart = code.indexOf(`if (editing === "ads_rewards_config") {`);
if (blockStart !== -1) {
    let nextIf = code.indexOf(`if (editing === "developer_profile") {`, blockStart);
    if (nextIf !== -1) {
        code = code.substring(0, blockStart) + code.substring(nextIf);
        fs.writeFileSync('src/pages/Admin.tsx', code);
        console.log("Fixed ads_rewards_config syntax");
    } else {
        console.log("developer_profile not found");
    }
}
