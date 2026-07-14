const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const targetStr = `<div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Adars (Others) Message Channel ID</label>
              <input type="text" value={botSettingData.othersChannelId || ""} onChange={(e) => setBotSettingData({...botSettingData, othersChannelId: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="@my_updates_channel or -100xxxxx" />
            </div>`;

const newStr = `<div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Adars (Others) Message Channel ID</label>
              <input type="text" value={botSettingData.othersChannelId || ""} onChange={(e) => setBotSettingData({...botSettingData, othersChannelId: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="@my_updates_channel or -100xxxxx" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Imgbb API Token</label>
              <input type="text" value={botSettingData.imgbbApiToken || ""} onChange={(e) => setBotSettingData({...botSettingData, imgbbApiToken: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="Enter Imgbb API Token" />
            </div>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  fs.writeFileSync('src/pages/Admin.tsx', content);
  console.log("Updated Bot Setting");
} else {
  console.log("Could not find Bot Setting target string");
}
