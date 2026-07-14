const fs = require('fs');
let content = fs.readFileSync('src/pages/Task.tsx', 'utf8');

const targetStr = `<h2 className="text-xl font-bold mb-4 px-2 flex items-center text-gray-800">
        <ListTodo className="mr-2 text-blue-600" /> Available Tasks
      </h2>`;

const newStr = `      <header className="flex items-center justify-between mb-8 text-[#2C334A] pt-2 px-2">
        <div>
           <h1 className="text-2xl font-black tracking-tight drop-shadow-sm flex items-center">
             <ListTodo className="mr-2 text-blue-600" /> Tasks
           </h1>
           <p className="text-sm font-medium text-gray-500 mt-1">Complete tasks to earn huge rewards</p>
        </div>
      </header>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/Task.tsx', content);
  console.log("Updated Task UI");
}
