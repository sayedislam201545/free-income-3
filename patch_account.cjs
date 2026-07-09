const fs = require('fs');

let code = fs.readFileSync('src/pages/AccountSettings.tsx', 'utf8');

// Replace main container background
code = code.replace(/bg-\[#0B0D14\] text-white/, 'bg-[#F8F9FE] text-gray-900');
// Remove ambient backgrounds
code = code.replace(/{[\s\S]*?3D Ambient Background[\s\S]*?<\/div>\s*<\/div>/, '');

// Replace header text
code = code.replace(/text-gray-200/g, 'text-gray-800');

// Replace box backgrounds
code = code.replace(/bg-white\/5 backdrop-blur-md rounded-2xl p-4 flex items-center border border-white\/10 shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\] hover:bg-white\/10 transition-colors/g, 
  'bg-white rounded-2xl p-4 flex items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow');

// Replace text colors
code = code.replace(/text-gray-100/g, 'text-gray-900');
code = code.replace(/text-gray-400 hover:text-white/g, 'text-gray-400 hover:text-gray-900');

fs.writeFileSync('src/pages/AccountSettings.tsx', code);
