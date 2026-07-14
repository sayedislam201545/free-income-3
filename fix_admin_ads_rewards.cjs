const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const newAdsRewards = `
if (editing === "ads_rewards_config") {
      return (
        <AdsRewardsEditor
          onClose={() => setEditing(null)}
          onSave={async (adsConfig, rewardsConfig, adsBoxes) => {
            try {
              await setDoc(doc(db, "settings", "ads_config"), adsConfig, { merge: true });
              await setDoc(doc(db, "settings", "rewards_config"), rewardsConfig, { merge: true });
              await setDoc(doc(db, "settings", "ads_boxes"), { boxes: adsBoxes }, { merge: true });
              useUIStore.getState().addToast("Saved Settings!");
              setEditing(null);
            } catch (e) {
              useUIStore.getState().addToast("Failed to save", "error");
            }
          }}
          initialAdsConfig={adsConfig}
          initialRewardsConfig={rewardsConfig}
        />
      );
    }`;

// Replace the old block
const regex = /if \(editing === "ads_rewards_config"\) \{[\s\S]*?(?=\s*if \(editing === "coin_values"\))/;
content = content.replace(regex, newAdsRewards + '\n');

// Add the AdsRewardsEditor component
const editorCode = `
function AdsRewardsEditor({ onClose, onSave, initialAdsConfig, initialRewardsConfig }: any) {
  const [activeTab, setActiveTab] = useState<"normal" | "vip" | "boxes" | "config">("normal");
  
  const [normalConfig, setNormalConfig] = useState({
    dailyBonusReward: initialRewardsConfig?.dailyBonusReward || 100,
    dailyAdsLimit: initialAdsConfig?.dailyAdsLimit || 50,
    adWatchDuration: initialAdsConfig?.adWatchDuration || 15,
    rewardPerAd: initialAdsConfig?.rewardPerAd || 50,
    referrerReward: initialRewardsConfig?.referrerReward || 50,
    referredReward: initialRewardsConfig?.referredReward || 50
  });

  const [vipConfig, setVipConfig] = useState({
    dailyBonusReward: initialRewardsConfig?.vipDailyBonusReward || 150,
    dailyAdsLimit: initialAdsConfig?.vipDailyAdsLimit || 100,
    adWatchDuration: initialAdsConfig?.vipAdWatchDuration || 10,
    rewardPerAd: initialAdsConfig?.vipRewardPerAd || 100,
    referrerReward: initialRewardsConfig?.vipReferrerReward || 100,
    referredReward: initialRewardsConfig?.vipReferredReward || 100
  });

  const [monetagConfig, setMonetagConfig] = useState({
    adsEnabled: initialAdsConfig?.adsEnabled || false,
    monetagZoneId: initialAdsConfig?.monetagZoneId || "",
    monetagScriptUrl: initialAdsConfig?.monetagScriptUrl || "",
    monetagSdk: initialAdsConfig?.monetagSdk || ""
  });

  const [adsBoxes, setAdsBoxes] = useState<any[]>([]);
  const [boxTab, setBoxTab] = useState<"add" | "old">("old");
  const [newBox, setNewBox] = useState({ id: "", title: "", photo: "", target: "normal", url: "", active: true });
  
  useEffect(() => {
    const fetchBoxes = async () => {
      const snap = await getDoc(doc(db, "settings", "ads_boxes"));
      if (snap.exists()) {
        setAdsBoxes(snap.data().boxes || []);
      }
    };
    fetchBoxes();
  }, []);

  const handleSave = () => {
    const finalAds = {
      ...monetagConfig,
      normalUser: {
        dailyAdsLimit: normalConfig.dailyAdsLimit,
        adWatchDuration: normalConfig.adWatchDuration,
        rewardPerAd: normalConfig.rewardPerAd
      },
      vipUser: {
        dailyAdsLimit: vipConfig.dailyAdsLimit,
        adWatchDuration: vipConfig.adWatchDuration,
        rewardPerAd: vipConfig.rewardPerAd
      }
    };
    
    // Fallback for backwards compatibility
    finalAds.dailyAdsLimit = normalConfig.dailyAdsLimit;
    finalAds.adWatchDuration = normalConfig.adWatchDuration;
    finalAds.rewardPerAd = normalConfig.rewardPerAd;

    const finalRewards = {
      dailyBonusReward: normalConfig.dailyBonusReward,
      referrerReward: normalConfig.referrerReward,
      referredReward: normalConfig.referredReward,
      vipDailyBonusReward: vipConfig.dailyBonusReward,
      vipReferrerReward: vipConfig.referrerReward,
      vipReferredReward: vipConfig.referredReward,
    };
    
    onSave(finalAds, finalRewards, adsBoxes);
  };

  const handleAddBox = () => {
    if (!newBox.title || !newBox.url) {
      useUIStore.getState().addToast("Title and URL required", "error");
      return;
    }
    const id = newBox.id || Date.now().toString();
    const updatedBoxes = newBox.id 
      ? adsBoxes.map(b => b.id === id ? newBox : b)
      : [...adsBoxes, { ...newBox, id }];
    setAdsBoxes(updatedBoxes);
    setNewBox({ id: "", title: "", photo: "", target: "normal", url: "", active: true });
    setBoxTab("old");
  };

  const ConfigForm = ({ state, setState }: any) => (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">Daily Ads Limit</label>
        <input type="number" value={state.dailyAdsLimit} onChange={(e) => setState({...state, dailyAdsLimit: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">Ad Watch Duration (seconds)</label>
        <input type="number" value={state.adWatchDuration} onChange={(e) => setState({...state, adWatchDuration: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">Reward Per Ad (Coins)</label>
        <input type="number" value={state.rewardPerAd} onChange={(e) => setState({...state, rewardPerAd: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
      </div>
      <div className="pt-4 border-t border-white/10">
        <label className="block text-xs font-bold text-gray-400 mb-1">Daily Bonus Claim (Coins)</label>
        <input type="number" value={state.dailyBonusReward} onChange={(e) => setState({...state, dailyBonusReward: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">Referrer Reward (Coins)</label>
        <input type="number" value={state.referrerReward} onChange={(e) => setState({...state, referrerReward: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
      </div>
      <div>
        <label className="block text-xs font-bold text-gray-400 mb-1">Referred User Reward (Coins)</label>
        <input type="number" value={state.referredReward} onChange={(e) => setState({...state, referredReward: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Ad & Rewards Settings</h2>
      </div>
      
      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6 overflow-x-auto no-scrollbar">
        <button onClick={() => setActiveTab("normal")} className={\`whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-all \${activeTab === "normal" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Normal User</button>
        <button onClick={() => setActiveTab("vip")} className={\`whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-all \${activeTab === "vip" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Vip User</button>
        <button onClick={() => setActiveTab("boxes")} className={\`whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-all \${activeTab === "boxes" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Ads Box</button>
        <button onClick={() => setActiveTab("config")} className={\`whitespace-nowrap px-4 py-2 rounded-lg font-bold transition-all \${activeTab === "config" ? "bg-red-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Conflicts (Monetag)</button>
      </div>

      <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
        {activeTab === "normal" && <ConfigForm state={normalConfig} setState={setNormalConfig} />}
        {activeTab === "vip" && <ConfigForm state={vipConfig} setState={setVipConfig} />}
        
        {activeTab === "config" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#0B0E14] border border-white/10 rounded-lg p-4 mb-4">
              <div>
                <span className="text-white block font-medium">Enable Ads System</span>
                <span className="text-gray-500 text-xs">Turn ad viewing on or off globally.</span>
              </div>
              <div
                className={\`w-12 h-6 rounded-full relative cursor-pointer transition-colors \${monetagConfig.adsEnabled ? "bg-blue-600" : "bg-gray-600"}\`}
                onClick={() => setMonetagConfig({ ...monetagConfig, adsEnabled: !monetagConfig.adsEnabled })}
              >
                <div className={\`absolute top-1 w-4 h-4 rounded-full bg-white transition-all \${monetagConfig.adsEnabled ? "left-7" : "left-1"}\`} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Direct Link URL</label>
              <input type="text" value={monetagConfig.monetagZoneId} onChange={(e) => setMonetagConfig({...monetagConfig, monetagZoneId: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. https://directlink..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Script URL (In-App Ad)</label>
              <input type="text" value={monetagConfig.monetagScriptUrl} onChange={(e) => setMonetagConfig({...monetagConfig, monetagScriptUrl: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. //thubanoa.com/1?z=12345" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Monetag SDK Function Name</label>
              <input type="text" value={monetagConfig.monetagSdk} onChange={(e) => setMonetagConfig({...monetagConfig, monetagSdk: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. show_9955574" />
            </div>
          </div>
        )}

        {activeTab === "boxes" && (
          <div className="space-y-4">
             <div className="flex space-x-2 bg-[#0B0E14] p-1.5 rounded-xl mb-4 w-fit border border-white/5">
                <button onClick={() => { setBoxTab("add"); setNewBox({ id: "", title: "", photo: "", target: "normal", url: "", active: true }); }} className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${boxTab === "add" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"}\`}>Add Box</button>
                <button onClick={() => setBoxTab("old")} className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${boxTab === "old" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"}\`}>Old Box</button>
             </div>

             {boxTab === "add" && (
               <div className="space-y-4 bg-[#0B0E14] p-4 rounded-xl border border-white/5">
                 <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Ad Title</label>
                    <input type="text" value={newBox.title} onChange={e => setNewBox({...newBox, title: e.target.value})} className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-sm text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Photo URL</label>
                    <input type="text" value={newBox.photo} onChange={e => setNewBox({...newBox, photo: e.target.value})} className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-sm text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Action URL</label>
                    <input type="text" value={newBox.url} onChange={e => setNewBox({...newBox, url: e.target.value})} className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-sm text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Target Audience</label>
                    <select value={newBox.target} onChange={e => setNewBox({...newBox, target: e.target.value})} className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-sm text-white">
                      <option value="normal">Normal Users</option>
                      <option value="vip">VIP Users</option>
                      <option value="all">All Users</option>
                    </select>
                 </div>
                 <button onClick={handleAddBox} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold">Save Box</button>
               </div>
             )}

             {boxTab === "old" && (
                <div className="space-y-3">
                  {adsBoxes.map(b => (
                    <div key={b.id} className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                       <div className="flex items-center space-x-3">
                         {b.photo && <img src={b.photo} className="w-10 h-10 rounded-lg object-cover" />}
                         <div>
                           <h4 className="font-bold text-white text-sm">{b.title}</h4>
                           <p className="text-xs text-gray-400">{b.target.toUpperCase()} • {b.active ? "Active" : "Inactive"}</p>
                         </div>
                       </div>
                       <div className="flex items-center space-x-2">
                         <button onClick={() => setAdsBoxes(adsBoxes.map(x => x.id === b.id ? {...x, active: !x.active} : x))} className={\`px-3 py-1.5 rounded-lg text-xs font-bold \${b.active ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}\`}>{b.active ? "Disable" : "Enable"}</button>
                         <button onClick={() => { setNewBox(b); setBoxTab("add"); }} className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-xs font-bold">Edit</button>
                         <button onClick={() => {
                            useUIStore.getState().showConfirm({
                              title: "Delete Ad Box",
                              message: "Are you sure you want to delete this ad box?",
                              onConfirm: () => setAdsBoxes(adsBoxes.filter(x => x.id !== b.id))
                            });
                         }} className="px-3 py-1.5 bg-gray-500/20 text-gray-400 rounded-lg text-xs font-bold"><Trash2 className="w-4 h-4"/></button>
                       </div>
                    </div>
                  ))}
                  {adsBoxes.length === 0 && <p className="text-center text-gray-500 text-sm py-4">No ad boxes created.</p>}
                </div>
             )}
          </div>
        )}

        {activeTab !== "boxes" && (
          <button onClick={handleSave} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">
            Save Settings
          </button>
        )}
      </div>
    </div>
  );
}
`;

content = content + '\n' + editorCode;

fs.writeFileSync('src/pages/Admin.tsx', content);
