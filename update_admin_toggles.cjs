const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Remove Feature Toggles from AdminDashboard
const toggleStart = content.indexOf('<h3 className="font-semibold mb-4">Feature Toggles</h3>');
if (toggleStart !== -1) {
    const divStart = content.lastIndexOf('<div className="bg-[#151A23] p-6 rounded-xl border border-white/5">', toggleStart);
    let divEnd = content.indexOf('</div>', toggleStart);
    divEnd = content.indexOf('</div>', divEnd + 1); // skip inner divs
    divEnd = content.indexOf('</div>', divEnd + 1);
    divEnd = content.indexOf('</div>', divEnd + 1);
    divEnd = content.indexOf('</div>', divEnd + 1);
    divEnd = content.indexOf('</div>', divEnd + 1);
    // actually, let's just use regex to remove it
    content = content.replace(/<div className="bg-\[#151A23\] p-6 rounded-xl border border-white\/5">\s*<h3 className="font-semibold mb-4">Feature Toggles<\/h3>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/, '');
    // let's do a safer replace using split/join or careful match
}
// Safer way to remove the toggles div
content = content.replace(/<div className="bg-\[#151A23\] p-6 rounded-xl border border-white\/5">\s*<h3 className="font-semibold mb-4">Feature Toggles<\/h3>[\s\S]*?(<div className="bg-\[#151A23\] p-6 rounded-xl border border-white\/5">|<\/div>\s*<\/div>\s*<\/div>)/, '$1');

// 2. Add Feature Toggles to AdminSettings
if (!content.includes('key: "feature_toggles"')) {
    const target = 'key: "bot_setting",';
    const injection = `key: "feature_toggles",
            desc: "Enable or disable system features",
            icon: "⚙️",
            label: "Feature Toggles",
          },
          {
            ${target}`;
    content = content.replace(target, injection);
}

// Add state handling
if (!content.includes('editing === "feature_toggles"')) {
    content = content.replace('if (editing === "ads_rewards_config") {', `if (editing === "feature_toggles") {
      return <FeatureTogglesEditor onClose={() => setEditing(null)} onSave={async (vals) => {
        await setDoc(doc(db, "settings", "feature_toggles"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Toggles");
        setEditing(null);
      }} />;
    }
    if (editing === "ads_rewards_config") {`);
}

// Define FeatureTogglesEditor at the end
if (!content.includes('function FeatureTogglesEditor')) {
    content += `
function FeatureTogglesEditor({ onClose, onSave }: any) {
  const [toggles, setToggles] = useState({
    registration: true,
    transfer: true,
    deposit: true,
    withdraw: true,
    luckyDraw: true,
    dailyCheckin: true
  });
  
  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, "settings", "feature_toggles"));
      if (snap.exists()) setToggles({ ...toggles, ...snap.data() });
    };
    fetch();
  }, []);

  const handleToggle = (key: string) => setToggles({...toggles, [key]: !toggles[key as keyof typeof toggles]});

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center space-x-4 mb-6">
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Feature Toggles</h2>
      </div>
      <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
        {[
          { label: "Registration", key: "registration" },
          { label: "Transfer", key: "transfer" },
          { label: "Deposit", key: "deposit" },
          { label: "Withdraw", key: "withdraw" },
          { label: "Lucky Draw", key: "luckyDraw" },
          { label: "Daily Check-in", key: "dailyCheckin" },
        ].map((f) => (
          <div key={f.key} className="flex items-center justify-between p-3 bg-[#0B0E14] rounded-xl border border-white/5">
            <span className="font-bold text-white">{f.label}</span>
            <div
              className={\`w-12 h-6 rounded-full relative cursor-pointer transition-colors \${toggles[f.key as keyof typeof toggles] ? "bg-blue-600" : "bg-gray-600"}\`}
              onClick={() => handleToggle(f.key)}
            >
              <div className={\`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all \${toggles[f.key as keyof typeof toggles] ? "right-0.5" : "left-0.5"}\`} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => onSave(toggles)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Save Changes</button>
    </div>
  );
}
`;
}

// 3. Add Imgbb api to BotSetting
if (!content.includes('Imgbb API Key')) {
    const target2 = '<label className="block text-xs font-bold text-gray-400 mb-1">Bot Username</label>';
    const inject2 = `<label className="block text-xs font-bold text-gray-400 mb-1">Imgbb API Key (For Task Proofs)</label>
              <input type="text" value={botSettingData.imgbbApi || ""} onChange={(e) => setBotSettingData({...botSettingData, imgbbApi: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white mb-4" placeholder="e.g. 1234567890abcdef..." />
              ` + target2;
    content = content.replace(target2, inject2);
}

// 4. Update AdminRequests to have Task Submissions
// We'll rename the activeType of submissions to "submissions" inside AdminRequests too
if (!content.includes('activeType === "submissions" ? "bg-green-600"')) {
    // Actually, AdminPayments currently has the Task Submissions tab. 
    // They want it moved to Requests section!
    // Inside AdminPayments, we have:
    /*
        <button
          onClick={() => { setActiveType("requests"); setIsEditing(null); }}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "requests" ? "bg-red-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Requests
        </button>
        ...
        <button
          onClick={() => { setActiveType("submissions"); setIsEditing(null); }}
    */
    // We can just keep it as a tab in AdminPayments, but maybe rename it to Requests Submissions? 
    // Or move the button next to Requests. Let's just reorganize the buttons so it's clear.
    // They said "Task Submissions এটাকে Request সেকশন থেকে কেনো সরিয়ে নিছো সেটা ঠিক কর,,,"
    // It implies I moved it FROM Request section TO somewhere else. 
    // Ah, wait, in AdminPayments, it IS currently inside Payments section.
    // Actually `AdminRequests` is a sub-component. 
    // Let me just move the "Task Submissions" button right next to "Requests" and rename the tab to "Task Requests" or just "Task Submissions".
}

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log('Updated Admin.tsx');
