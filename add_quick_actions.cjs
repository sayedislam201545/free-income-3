const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const quickActions = `
      {/* Quick Actions (Main Menu) */}
      <div className="flex justify-between items-center space-x-3 mb-6">
        <button 
          onClick={() => navigate('/tasks')}
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3.5 rounded-2xl shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <span className="text-xl">📋</span>
          <span>Tasks</span>
        </button>
        <button 
          onClick={() => navigate('/ads')}
          className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3.5 rounded-2xl shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-all"
        >
          <span className="text-xl">📺</span>
          <span>Ads</span>
        </button>
      </div>

      {/* Content Grid */}`;

code = code.replace('{/* Content Grid */}', quickActions);
fs.writeFileSync('src/pages/Dashboard.tsx', code);
