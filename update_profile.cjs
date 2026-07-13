const fs = require('fs');
let code = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const idCardTarget = `          <div 
            onClick={() => handleCopy(displayUser.uid)}
            className="flex items-center space-x-1.5 bg-white/5 px-3 py-1 rounded-xl border border-white/10 mb-2 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <span className="opacity-70 text-gray-300 text-xs font-medium">
              ID:
            </span>
            <span className="text-blue-200 text-sm font-bold tracking-wider">
              {displayUser.uid}
            </span>
            <Copy className="w-3.5 h-3.5 text-gray-400" />
          </div>`;

const idCardReplacement = ``;

code = code.replace(idCardTarget, idCardReplacement);

const verifyTarget = `          <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm mb-1">
            {displayUser.fullName || displayUser.username}
          </h2>`;
const verifyReplacement = `          <div className="flex items-center justify-center space-x-1 mb-1">
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {displayUser.fullName || displayUser.username}
            </h2>
            <div className="bg-blue-500 rounded-full p-0.5">
               <Check className="w-3 h-3 text-white" strokeWidth={4} />
            </div>
          </div>
          <p className="text-blue-200 text-sm font-bold tracking-wider mb-2">@{displayUser.username || displayUser.telegramId}</p>`;

code = code.replace(verifyTarget, verifyReplacement);

const imgTarget = `<img src={displayUser.photoUrl} alt="Profile" className="w-full h-full object-cover" />`;
const imgReplacement = `<img src={displayUser.photoUrl} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />`;
code = code.replace(imgTarget, imgReplacement);

const importTarget = `import { User, Copy`;
const importReplacement = `import { User, Copy, Check`;
code = code.replace(importTarget, importReplacement);

fs.writeFileSync('src/pages/Profile.tsx', code);
console.log("Profile updated!");
