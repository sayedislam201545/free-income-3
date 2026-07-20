const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regexButtons = /<button[\s\S]*?onClick=\{\(\) => \{ setActiveType\("achievements"\); setIsEditing\(null\); \}\}[\s\S]*?>[\s\S]*?Achievements[\s\S]*?<\/button>/;

const newButton = `<button
          onClick={() => { setActiveType("achievements"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "achievements" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Achievements
        </button>
        <button
          onClick={() => { setActiveType("submissions"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "submissions" ? "bg-orange-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Submissions
        </button>`;

code = code.replace(regexButtons, newButton);

const regexComponents = /\{activeType === "requests" && <AdminRequests \/>\}/;
const newComponents = `{activeType === "requests" && <AdminRequests />}
      {activeType === "submissions" && <AdminSubmissions />}`;

code = code.replace(regexComponents, newComponents);
fs.writeFileSync('src/pages/Admin.tsx', code);
