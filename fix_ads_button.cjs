const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `<button onClick={() => onSave(values)} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-xl text-white">Save Changes</button>`;
const replacement = `<button onClick={handleLocalSave} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-xl text-white">Save Changes</button>`;

code = code.replace(target, replacement);

fs.writeFileSync('src/pages/Admin.tsx', code);
