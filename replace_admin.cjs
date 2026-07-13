const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Script URL (In-App Ad)</label>
                  <input type="text" value={adsConfig?.monetagScriptUrl || ""} onChange={(e) => setAdsConfig({...adsConfig, monetagScriptUrl: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. //thubanoa.com/1?z=12345" />
                </div>
              </>`;

const replacement = `                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Script URL (In-App Ad)</label>
                  <input type="text" value={adsConfig?.monetagScriptUrl || ""} onChange={(e) => setAdsConfig({...adsConfig, monetagScriptUrl: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. //thubanoa.com/1?z=12345" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Monetag SDK Function Name</label>
                  <input type="text" value={adsConfig?.monetagSdk || ""} onChange={(e) => setAdsConfig({...adsConfig, monetagSdk: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. show_9955574" />
                </div>
              </>`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Admin updated successfully!");
} else {
    console.log("Target not found in Admin.tsx!");
}
