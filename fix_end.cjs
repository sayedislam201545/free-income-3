const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// The file currently has garbage starting with ` from "react";` at line 1713.
let garbageIndex = code.indexOf(' from "react";');
if (garbageIndex !== -1) {
    code = code.substring(0, garbageIndex);
}

// Ensure the last component is properly closed. The last component was AdsRewardsEditor.
// It ends with \n  }\n);
// Then let's add FeatureTogglesEditor.
const featureTogglesCode = `
function FeatureTogglesEditor({ onClose, onSave }: any) {
  const [toggles, setToggles] = useState<any>({
    showAds: true,
    enableWithdrawals: true,
    maintenanceMode: false
  });

  useEffect(() => {
    // Fetch initial state or use default
  }, []);

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Feature Toggles</h2>
      </div>
      <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
         <div className="flex justify-between items-center">
            <span className="text-white font-medium">Show Ads</span>
            <input type="checkbox" checked={toggles.showAds} onChange={(e) => setToggles({...toggles, showAds: e.target.checked})} />
         </div>
         <div className="flex justify-between items-center">
            <span className="text-white font-medium">Enable Withdrawals</span>
            <input type="checkbox" checked={toggles.enableWithdrawals} onChange={(e) => setToggles({...toggles, enableWithdrawals: e.target.checked})} />
         </div>
         <div className="flex justify-between items-center">
            <span className="text-white font-medium">Maintenance Mode</span>
            <input type="checkbox" checked={toggles.maintenanceMode} onChange={(e) => setToggles({...toggles, maintenanceMode: e.target.checked})} />
         </div>
         <button onClick={() => onSave(toggles)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl">Save Toggles</button>
      </div>
    </div>
  );
}
`;

code += featureTogglesCode;

fs.writeFileSync('src/pages/Admin.tsx', code);
