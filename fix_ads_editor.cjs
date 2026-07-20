const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Rename the tab to 'Ads Configs'
code = code.replace(
  'onClick={() => setActiveTab("config")} className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "config" ? "bg-red-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>Conflicts (Monetag)</button>',
  'onClick={() => setActiveTab("config")} className={`whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-all ${activeTab === "config" ? "bg-red-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>Ads Configs</button>'
);

// Make the save button visible on all tabs
code = code.replace(
  '{activeTab !== "boxes" && (\n          <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">\n            Save Settings\n          </button>\n        )}',
  '<button onClick={handleSave} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg mt-6">\n          Save Settings\n        </button>'
);

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log('AdsRewardsEditor fixed');
