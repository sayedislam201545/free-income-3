const fs = require('fs');

function replaceDark(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Backgrounds
  code = code.replace(/bg-\[\#0B0E14\]/g, 'bg-gray-50');
  code = code.replace(/bg-\[\#151A23\]/g, 'bg-white');
  code = code.replace(/bg-\[\#1C2331\]/g, 'bg-gray-100');
  
  // Text colors
  code = code.replace(/text-white/g, 'text-gray-900');
  code = code.replace(/text-gray-400/g, 'text-gray-600');
  code = code.replace(/text-gray-300/g, 'text-gray-700');
  
  // Borders
  code = code.replace(/border-white\/5/g, 'border-gray-200');
  code = code.replace(/border-white\/10/g, 'border-gray-300');
  
  // Ensure that buttons that need white text stay white if they are colored
  // Like bg-blue-600 text-gray-900 -> bg-blue-600 text-white
  code = code.replace(/bg-blue-600 text-gray-900/g, 'bg-blue-600 text-white');
  code = code.replace(/bg-purple-600 text-gray-900/g, 'bg-purple-600 text-white');
  code = code.replace(/bg-emerald-600 text-gray-900/g, 'bg-emerald-600 text-white');
  code = code.replace(/bg-orange-600 text-gray-900/g, 'bg-orange-600 text-white');
  
  fs.writeFileSync(filePath, code);
}

replaceDark('src/pages/Dashboard.tsx');
replaceDark('src/pages/Task.tsx');
replaceDark('src/pages/AdDetail.tsx');
replaceDark('src/components/GlobalUI.tsx');
console.log('Replaced dark mode in files');
