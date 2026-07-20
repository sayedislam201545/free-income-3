const fs = require('fs');
let dbTsx = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

dbTsx = dbTsx.replace('bg-gradient-to-b from-slate-50 to-indigo-50 text-gray-900', 'bg-[#0B0E14] text-white');
dbTsx = dbTsx.replace('text-[#2C334A]', 'text-white');
dbTsx = dbTsx.replace('bg-white', 'bg-[#151A23]');
dbTsx = dbTsx.replace('bg-gradient-to-b from-white to-gray-50/90', 'bg-[#151A23]');
dbTsx = dbTsx.replace('border-white/60', 'border-white/5');
dbTsx = dbTsx.replace('shadow-[0_8px_16px_rgba(0,0,0,0.06),inset_0_4px_8px_rgba(255,255,255,0.8),0_2px_4px_rgba(0,0,0,0.04)]', 'shadow-xl');
dbTsx = dbTsx.replace('from-white/40', 'from-white/5');
dbTsx = dbTsx.replace('text-[#2C334A]', 'text-gray-300');
dbTsx = dbTsx.replace('bg-gradient-to-b from-white', 'bg-gradient-to-b from-[#1C2331]');
dbTsx = dbTsx.replace('border border-white', 'border border-white/10');
dbTsx = dbTsx.replace('bg-gray-100', 'bg-[#1C2331]');

fs.writeFileSync('src/pages/Dashboard.tsx', dbTsx);
console.log('Updated Dashboard design');
