const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const start = code.indexOf('function AdminSettings() {');
const end = code.indexOf('function AdminVIP() {');

if (start === -1 || end === -1) {
    console.error("Could not find bounds");
    process.exit(1);
}

const safeSettings = `function AdminSettings() {
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  
  // Data States
  const [botSettingData, setBotSettingData] = useState<any>({ botUsername: "", botToken: "", botHostingLink: "", miniAppUrl: "", paymentChannelId: "", othersChannelId: "", imgbbApi: "" });
  const [developerData, setDeveloperData] = useState<any>({ name: "", role: "", whatsapp: "", telegram: "", image: "", description: "" });
  const [supportAgents, setSupportAgents] = useState<any[]>([]);
  const [vipPlans, setVipPlans] = useState<any[]>([]);
  const [adsConfig, setAdsConfig] = useState<any>({});
  const [rewardsConfig, setRewardsConfig] = useState<any>({});
  
  const [adminTab, setAdminTab] = useState<"added" | "add">("added");
  const [editSupportId, setEditSupportId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const botSnap = await getDoc(doc(db, "settings", "bot_setting"));
        if (botSnap.exists()) setBotSettingData(botSnap.data());

        const devSnap = await getDoc(doc(db, "settings", "developer_profile"));
        if (devSnap.exists()) setDeveloperData(devSnap.data());

        const supportSnap = await getDoc(doc(db, "settings", "support"));
        if (supportSnap.exists() && supportSnap.data().agents) setSupportAgents(supportSnap.data().agents);

        const vipSnap = await getDoc(doc(db, "settings", "vip_plans"));
        if (vipSnap.exists() && vipSnap.data().plans) setVipPlans(vipSnap.data().plans);

        const adsSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
        if (adsSnap.exists()) {
          setAdsConfig(adsSnap.data().ads || {});
          setRewardsConfig(adsSnap.data().rewards || {});
        }
      } catch (e) {
        console.error("Failed to load settings:", e);
      }
    };
    fetchSettings();
  }, [editing]);

  const handleEdit = async (key: string) => {
    setEditing(key);
    if (!["bot_setting", "developer_profile", "support", "vip_plan", "feature_toggles", "ads_rewards_config", "coin_values"].includes(key)) {
      const snap = await getDoc(doc(db, "settings", key));
      setEditContent(snap.exists() ? snap.data().content || "" : "");
    }
  };

  const handleSave = async (stayOpen: boolean = false) => {
    if (editing) {
      try {
        if (editing === "bot_setting") {
          await setDoc(doc(db, "settings", "bot_setting"), botSettingData);
        } else if (editing === "developer_profile") {
          await setDoc(doc(db, "settings", "developer_profile"), developerData, { merge: true });
        } else if (editing === "support") {
          await setDoc(doc(db, "settings", "support"), { agents: supportAgents.filter((a: any) => a.name && a.name.trim() !== "") }, { merge: true });
        } else if (editing === "vip_plan") {
          await setDoc(doc(db, "settings", "vip_plans"), { plans: vipPlans.filter((p: any) => (p.title || p.name || "").trim() !== "") }, { merge: true });
        } else if (!["feature_toggles", "ads_rewards_config", "coin_values"].includes(editing)) {
          await setDoc(doc(db, "settings", editing), { content: editContent }, { merge: true });
        }
        
        useUIStore.getState().addToast("Saved successfully!");
        if (!stayOpen) setEditing(null);
      } catch (err) {
        useUIStore.getState().addToast("Failed to save", "error");
      }
    }
  };

  if (editing) {
    if (editing === "feature_toggles") {
      return <FeatureTogglesEditor onClose={() => setEditing(null)} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "feature_toggles"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Toggles");
        setEditing(null);
      }} />;
    }
    if (editing === "ads_rewards_config") {
      return <AdsRewardsEditor onClose={() => setEditing(null)} initialAdsConfig={adsConfig} initialRewardsConfig={rewardsConfig} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "ads_rewards_config"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Config");
        setEditing(null);
      }} />;
    }
    if (editing === "coin_values") {
      return <CoinValuesEditor onClose={() => setEditing(null)} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "coin_values"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Coin Values");
        setEditing(null);
      }} />;
    }

    if (editing === "developer_profile") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Developer Profile</h2>
          </div>
          <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Name</label><input type="text" value={developerData.name || ""} onChange={(e) => setDeveloperData({...developerData, name: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Role Title</label><input type="text" value={developerData.role || ""} onChange={(e) => setDeveloperData({...developerData, role: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Photo URL</label><input type="text" value={developerData.image || ""} onChange={(e) => setDeveloperData({...developerData, image: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://..." /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Bio / Description</label><textarea value={developerData.description || ""} onChange={(e) => setDeveloperData({...developerData, description: e.target.value})} className="w-full h-24 bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">WhatsApp URL</label><input type="text" value={developerData.whatsapp || ""} onChange={(e) => setDeveloperData({...developerData, whatsapp: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://wa.me/..." /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Telegram URL</label><input type="text" value={developerData.telegram || ""} onChange={(e) => setDeveloperData({...developerData, telegram: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://t.me/..." /></div>
          </div>
          <button onClick={() => handleSave(false)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">Save Developer Profile</button>
        </div>
      );
    }

    if (editing === "bot_setting") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Bot Settings</h2>
          </div>
          <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
             <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Imgbb API Key (For Task Proofs)</label>
              <input type="text" value={botSettingData.imgbbApi || ""} onChange={(e) => setBotSettingData({...botSettingData, imgbbApi: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white mb-4" placeholder="e.g. 1234567890abcdef..." />
              <label className="block text-xs font-bold text-gray-400 mb-1">Bot Username</label>
              <input type="text" value={botSettingData.botUsername || ""} onChange={(e) => setBotSettingData({...botSettingData, botUsername: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
             </div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Bot Token</label><input type="password" value={botSettingData.botToken || ""} onChange={(e) => setBotSettingData({...botSettingData, botToken: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Payment Channel ID</label><input type="text" value={botSettingData.paymentChannelId || ""} onChange={(e) => setBotSettingData({...botSettingData, paymentChannelId: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
          </div>
          <button onClick={() => handleSave(false)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl">Save Settings</button>
        </div>
      );
    }

    if (editing === "vip_plan") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <AdminVIP />
        </div>
      );
    }

    if (editing === "support") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Support Management</h2>
          </div>
          <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
            <button onClick={() => setAdminTab("added")} className={\`flex-1 py-2 rounded-lg font-bold transition-all \${adminTab === "added" ? "bg-blue-600 text-white" : "text-gray-400"}\`}>Support Lists</button>
            <button onClick={() => { setAdminTab("add"); setEditSupportId(null); setSupportAgents([...supportAgents, { id: Date.now().toString(), name: "", role: "", link: "", avatar: "" }]); setEditSupportId(Date.now().toString()); }} className={\`flex-1 py-2 rounded-lg font-bold transition-all \${adminTab === "add" ? "bg-blue-600 text-white" : "text-gray-400"}\`}>Add New</button>
          </div>
          {adminTab === "added" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportAgents.filter(a => a.name.trim() !== "").map(agent => (
                <div key={agent.id} className="bg-[#151A23] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div><p className="font-bold text-white">{agent.name}</p><p className="text-xs text-gray-400">{agent.role}</p></div>
                  <div className="flex space-x-2">
                    <button onClick={() => { setEditSupportId(agent.id); setAdminTab("add"); }} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => { setSupportAgents(supportAgents.filter(a => a.id !== agent.id)); setTimeout(() => handleSave(true), 100); }} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {adminTab === "add" && (
            <div className="space-y-6">
              {supportAgents.filter(a => a.id === editSupportId).map(agent => (
                <div key={agent.id} className="bg-[#151A23] border border-white/10 rounded-xl p-6">
                  <div className="space-y-4">
                    <div><label className="text-xs text-gray-400">Name</label><input type="text" value={agent.name} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, name: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Role</label><input type="text" value={agent.role} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, role: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Link (e.g. https://t.me/user)</label><input type="text" value={agent.link} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, link: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button onClick={() => { handleSave(true); setAdminTab("added"); }} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl">Save Agent</button>
                    <button onClick={() => { setSupportAgents(supportAgents.filter(a => a.name.trim() !== "")); setAdminTab("added"); }} className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-xl">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Edit Content</h2>
          </div>
          <button onClick={() => handleSave()} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium">Save Content</button>
        </div>
        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full h-96 bg-[#151A23] border border-white/10 rounded-xl p-4 text-white" placeholder="Write content here..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Admin Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Coin Values", desc: "Manage coin values", key: "coin_values", icon: <Coins className="w-5 h-5 text-yellow-400" /> },
          { title: "Ad & Rewards", desc: "Manage limits & rewards", key: "ads_rewards_config", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Feature Toggles", desc: "Enable/disable features", key: "feature_toggles", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Bot Settings", desc: "Tokens & Configs", key: "bot_setting", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Developer Profile", desc: "App Owner Info", key: "developer_profile", icon: <User className="w-5 h-5 text-purple-400" /> },
          { title: "Support Management", desc: "Admin Contacts", key: "support", icon: <Settings className="w-5 h-5 text-green-400" /> },
          { title: "VIP Plans", desc: "Manage Subscriptions", key: "vip_plan", icon: <Settings className="w-5 h-5 text-purple-400" /> },
          { title: "Privacy Policy", desc: "App Policies", key: "privacy_policy", icon: <FileText className="w-5 h-5 text-gray-400" /> },
          { title: "Terms & Conditions", desc: "App Terms", key: "terms", icon: <FileText className="w-5 h-5 text-gray-400" /> },
          { title: "About Us", desc: "Company Info", key: "about", icon: <FileText className="w-5 h-5 text-gray-400" /> },
        ].map((section) => (
          <div key={section.key} className="bg-[#151A23] p-5 rounded-2xl border border-white/5 shadow-lg group hover:border-blue-500/30 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-[#0B0E14] rounded-xl">{section.icon}</div>
              <div><h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{section.title}</h3><p className="text-xs text-gray-500">{section.desc}</p></div>
            </div>
            <button onClick={() => handleEdit(section.key)} className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl transition-colors text-sm font-bold border border-blue-600/20">Edit Content</button>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

code = code.substring(0, start) + safeSettings + '\n\n' + code.substring(end);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("AdminSettings perfectly rewritten.");

