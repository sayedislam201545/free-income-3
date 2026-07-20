const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Remove Task Submissions from AdminPayments tabs
content = content.replace(/<button\s*onClick=\{\(\) => \{ setActiveType\("submissions"\); setIsEditing\(null\); \}\}\s*className=\{`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \$\{activeType === "submissions" \? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white\/5"}`\}\s*>\s*Task Submissions\s*<\/button>/, '');
content = content.replace('{activeType === "submissions" && <AdminSubmissions />}', '');

// 2. Add it into AdminRequests
const adminReqStart = content.indexOf('function AdminRequests() {');
if (adminReqStart !== -1) {
    let reqContent = content.slice(adminReqStart);
    const reqEnd = reqContent.indexOf('function CoinValuesEditor');
    reqContent = reqContent.slice(0, reqEnd);
    
    // Replace activeType useState
    reqContent = reqContent.replace('const [activeType, setActiveType] = useState<"deposit" | "withdraw">("deposit");', 'const [activeType, setActiveType] = useState<"deposit" | "withdraw" | "submissions">("deposit");');
    
    // Update the tabs inside AdminRequests
    const tabTarget = `<button
            onClick={() => setActiveType("withdraw")}
            className={\`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all \${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
          >
            Withdrawals
          </button>`;
    const newTabs = tabTarget + `\n          <button
            onClick={() => setActiveType("submissions")}
            className={\`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all \${activeType === "submissions" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
          >
            Task Submissions
          </button>`;
          
    reqContent = reqContent.replace(tabTarget, newTabs);
    
    // Update the render logic: if activeType is submissions, render AdminSubmissions, otherwise render the old table
    const tableStart = reqContent.indexOf('<div className="bg-[#151A23] rounded-2xl border border-white/5 overflow-hidden">');
    const returnEnd = reqContent.lastIndexOf('</div>\n    </div>\n  );');
    
    let tableCode = reqContent.slice(tableStart, returnEnd);
    
    let newTableCode = `{activeType === "submissions" ? <AdminSubmissions /> : (\n        ` + tableCode.replace(/\n/g, '\n        ') + `\n      )}`;
    
    reqContent = reqContent.slice(0, tableStart) + newTableCode + reqContent.slice(returnEnd);
    
    content = content.slice(0, adminReqStart) + reqContent + content.slice(adminReqStart + reqEnd);
    fs.writeFileSync('src/pages/Admin.tsx', content);
    console.log('Fixed AdminRequests');
}

