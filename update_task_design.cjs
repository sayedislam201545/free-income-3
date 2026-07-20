const fs = require('fs');
let task = fs.readFileSync('src/pages/Task.tsx', 'utf8');

// Replace light classes with dark classes
task = task.replace('bg-gray-50 text-gray-900', 'bg-[#0B0E14] text-white');
task = task.replace('text-[#2C334A]', 'text-white');
task = task.replace('text-gray-500', 'text-gray-400');
task = task.replace('bg-white', 'bg-[#151A23]');
task = task.replace('border-gray-100', 'border-white/5');
task = task.replace('text-gray-600', 'text-gray-300');
task = task.replace('bg-blue-50/50 border-blue-100', 'bg-blue-900/20 border-blue-500/20');
task = task.replace('bg-gradient-to-r from-blue-500 to-indigo-500', 'bg-gradient-to-r from-blue-600 to-blue-400');
task = task.replace('bg-gradient-to-br from-blue-100 to-indigo-100', 'bg-[#1C2331]');
task = task.replace('border border-white', 'border border-white/5');
task = task.replace('text-amber-600', 'text-yellow-400');
task = task.replace('bg-amber-100 border-amber-200', 'bg-yellow-500/10 border-yellow-500/20');

task = task.replace('bg-white shadow-[0_4px_0_rgb(229,231,235)]', 'bg-[#151A23] shadow-[0_4px_0_rgb(30,40,60)] text-gray-300 border-2 border-[#1C2331] hover:bg-[#1C2331]');
task = task.replace('bg-gradient-to-b from-blue-400 to-blue-600 text-white shadow-[0_4px_0_rgb(30,58,138)] border-b border-blue-700', 'bg-gradient-to-b from-blue-600 to-blue-800 text-white shadow-[0_4px_0_rgb(30,58,138)] border-b border-blue-900');

fs.writeFileSync('src/pages/Task.tsx', task);
console.log('Updated Task design');
