const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const newAdsRewardsEditor = `
function AdsRewardsEditor({ onClose, onSave, initialAdsConfig, initialRewardsConfig, initialAdsBoxes }: any) {
  const [activeTab, setActiveTab] = useState<"normal" | "vip" | "ads_box" | "ads_config">("normal");
  
  const [adsConf, setAdsConf] = useState<any>(initialAdsConfig || {
    adsEnabled: true,
    dailyAdsLimit: 50,
    adWatchDuration: 15,
    rewardPerAd: 50,
    monetagZoneId: "",
    monetagSdk: ""
  });
  
  const [rewConf, setRewConf] = useState<any>(initialRewardsConfig || {
    dailyBonusReward: 100,
    vipBonusMultiplier: 1.5,
  });

  const [boxes, setBoxes] = useState<any[]>(initialAdsBoxes || []);

  const handleSave = () => {
    onSave(adsConf, rewConf, boxes);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Ad & Rewards Settings</h2>
      </div>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl overflow-x-auto w-full mb-6 no-scrollbar">
        <button
          onClick={() => setActiveTab("normal")}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeTab === "normal" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Normal User
        </button>
        <button
          onClick={() => setActiveTab("vip")}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeTab === "vip" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Vip User
        </button>
        <button
          onClick={() => setActiveTab("ads_box")}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeTab === "ads_box" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Ads Box
        </button>
        <button
          onClick={() => setActiveTab("ads_config")}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeTab === "ads_config" ? "bg-amber-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Ads Configs
        </button>
      </div>

      <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
        {activeTab === "normal" && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-white mb-4">Normal User Rewards & Limits</h3>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Daily Bonus Reward (VA)</label>
              <input type="number" value={rewConf.dailyBonusReward || ""} onChange={(e) => setRewConf({ ...rewConf, dailyBonusReward: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Daily Ads Limit</label>
              <input type="number" value={adsConf.dailyAdsLimit || ""} onChange={(e) => setAdsConf({ ...adsConf, dailyAdsLimit: parseInt(e.target.value) || 0 })} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Reward Per Ad (VA)</label>
              <input type="number" value={adsConf.rewardPerAd || ""} onChange={(e) => setAdsConf({ ...adsConf, rewardPerAd: parseFloat(e.target.value) || 0 })} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
            </div>
          </div>
        )}

        {activeTab === "vip" && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-white mb-4">VIP User Rewards & Multipliers</h3>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">VIP Bonus Multiplier</label>
              <input type="number" step="0.1" value={rewConf.vipBonusMultiplier || ""} onChange={(e) => setRewConf({ ...rewConf, vipBonusMultiplier: parseFloat(e.target.value) || 1 })} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
              <p className="text-xs text-gray-500 mt-1">E.g. 1.5 means VIPs get 1.5x more rewards from tasks/ads.</p>
            </div>
          </div>
        )}

        {activeTab === "ads_box" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-bold text-white">Ads Boxes</h3>
               <button onClick={() => setBoxes([...boxes, { id: Date.now().toString(), name: "", reward: 0 }])} className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-white font-bold">+ Add Box</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {boxes.map(box => (
                <div key={box.id} className="bg-[#0B0E14] p-4 rounded-xl border border-white/10 flex flex-col space-y-3">
                   <div className="flex justify-between">
                     <span className="text-sm font-bold text-white">Box Details</span>
                     <button onClick={() => setBoxes(boxes.filter(b => b.id !== box.id))} className="text-red-400 hover:text-red-300 text-xs font-bold"><Trash2 className="w-4 h-4"/></button>
                   </div>
                   <input type="text" placeholder="Box Name" value={box.name} onChange={e => setBoxes(boxes.map(b => b.id === box.id ? {...b, name: e.target.value} : b))} className="w-full bg-[#151A23] border border-white/10 rounded-lg p-2 text-sm text-white" />
                   <input type="number" placeholder="Reward Amount" value={box.reward || ""} onChange={e => setBoxes(boxes.map(b => b.id === box.id ? {...b, reward: parseFloat(e.target.value) || 0} : b))} className="w-full bg-[#151A23] border border-white/10 rounded-lg p-2 text-sm text-white" />
                </div>
              ))}
              {boxes.length === 0 && <div className="text-center text-gray-500 py-4 text-sm">No ads boxes added yet.</div>}
            </div>
          </div>
        )}

        {activeTab === "ads_config" && (
          <div className="space-y-4 animate-in fade-in">
             <h3 className="font-bold text-white mb-4">Ads Monetization Configurations</h3>
             <div className="flex justify-between items-center bg-[#0B0E14] p-4 rounded-xl border border-white/10">
                <span className="text-white font-bold text-sm">Enable Ads System</span>
                <input type="checkbox" checked={adsConf.adsEnabled} onChange={(e) => setAdsConf({...adsConf, adsEnabled: e.target.checked})} className="w-5 h-5" />
             </div>
             <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Ad Watch Duration (Seconds)</label>
              <input type="number" value={adsConf.adWatchDuration || ""} onChange={(e) => setAdsConf({ ...adsConf, adWatchDuration: parseInt(e.target.value) || 15 })} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
            </div>
             <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Zone ID</label>
              <input type="text" value={adsConf.monetagZoneId || ""} onChange={(e) => setAdsConf({ ...adsConf, monetagZoneId: e.target.value })} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. 1234567" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Monetag SDK / Script Tag</label>
              <textarea value={adsConf.monetagSdk || ""} onChange={(e) => setAdsConf({ ...adsConf, monetagSdk: e.target.value })} className="w-full h-24 bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white font-mono" placeholder="<script src='...'></script>" />
            </div>
          </div>
        )}

        <button onClick={handleSave} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg mt-6">
          Save Settings
        </button>
      </div>
    </div>
  );
}
`;

const startIdx = code.indexOf('function AdsRewardsEditor(');
const endIdx = code.indexOf('function FeatureTogglesEditor(');

if (startIdx !== -1 && endIdx !== -1) {
    code = code.substring(0, startIdx) + newAdsRewardsEditor + '\n' + code.substring(endIdx);
    fs.writeFileSync('src/pages/Admin.tsx', code); 
    console.log("Successfully rebuilt AdsRewardsEditor and saved to Admin.tsx");
} else {
    console.log("Could not find start or end index!");
}
