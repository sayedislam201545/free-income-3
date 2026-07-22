const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /if \(editing === "developer_profile"\) \{[\s\S]*?<\/div>\s*\);\s*\}/;

const newDev = `if (editing === "developer_profile") {
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
    }`;

if(code.match(regex)) {
    code = code.replace(regex, newDev);
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Admin Developer Profile patched");
}
