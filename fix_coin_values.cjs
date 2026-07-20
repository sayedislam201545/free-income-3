const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_clean.tsx', 'utf8');

const target = `<button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">`;
const replacement = `<button onClick={() => {
        const finalValues = {};
        [...(methods.deposit || []), ...(methods.withdraw || [])].forEach((m) => {
          finalValues[m.name] = values[m.name] || 0;
        });
        onSave(finalValues);
      }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Admin_clean.tsx', code);
