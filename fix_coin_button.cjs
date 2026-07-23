const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace(/<button onClick=\{handleLocalSave\} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes<\/button>\s*<\/div>\s*\}\s*\);\s*\}\s*function AdsRewardsEditor/g, 
`<button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>
    </div>
  );
}
function AdsRewardsEditor`);

fs.writeFileSync('src/pages/Admin.tsx', code);
