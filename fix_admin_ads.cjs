const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Remove Coin Values block from the Admin Settings grid
code = code.replace(/\{\s*title: "Coin Values", desc: "Manage coin values", key: "coin_values", icon: <Coins className="w-5 h-5 text-yellow-400" \/>\s*\},\s*/g, '');

// Update AdsRewardsEditor to include Coin values and save both
const oldAdsEditor = `function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>({ 
    normal: initialValues?.normal || {}, 
    vip: initialValues?.vip || {}, 
    settings: initialValues?.settings || {} 
  });`;

const newAdsEditor = `function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>({ 
    normal: initialValues?.normal || {}, 
    vip: initialValues?.vip || {}, 
    settings: initialValues?.settings || {},
    coinValues: {}
  });

  useEffect(() => {
    import("firebase/firestore").then(m => {
        m.getDoc(m.doc(db, "settings", "coin_values")).then(snap => {
            if (snap.exists()) {
                setValues(prev => ({ ...prev, coinValues: snap.data() }));
            }
        });
    });
  }, []);

  const handleLocalSave = async () => {
    try {
        const { getDoc, doc, setDoc } = require("firebase/firestore");
        // Save Ads config
        await setDoc(doc(db, "settings", "ads_rewards_config"), { normal: values.normal, vip: values.vip, settings: values.settings }, { merge: true });
        // Save Coin values
        await setDoc(doc(db, "settings", "coin_values"), values.coinValues, { merge: true });
        
        onClose();
        useUIStore.getState().addToast("Saved Settings successfully");
    } catch (e) {
        useUIStore.getState().addToast("Error saving", "error");
    }
  };`;

if (code.includes('function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {')) {
    code = code.replace(oldAdsEditor, newAdsEditor);
} else {
    console.log("Could not find AdsRewardsEditor signature.");
}

// Replace the button onClick to use handleLocalSave
const oldAdsButton = `<button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>`;
const newAdsButton = `<button onClick={handleLocalSave} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>`;

code = code.replace(oldAdsButton, newAdsButton);

const oldCoinValuesSection = `<h3 className="font-bold text-lg">General Settings</h3>`;
const newCoinValuesSection = `<h3 className="font-bold text-lg">General Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-green-400">BDT Values (৳)</label>
            <input type="number" step="any" value={values.coinValues?.bdtRate || values.coinValues?.bKash || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, bdtRate: parseFloat(e.target.value) || 0, bKash: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Crypto Values ($)</label>
            <input type="number" step="any" value={values.coinValues?.cryptoRate || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, cryptoRate: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>`;

code = code.replace(oldCoinValuesSection, newCoinValuesSection);

// Make normal/vip fields 2 columns
const oldAdsFields = `<div>
          <label className="block text-sm mb-1 text-gray-400">Normal Ads Daily Limit</label>
          <input type="number" value={values.normal?.adsLimit ?? 10} onChange={e => setValues({...values, normal: {...values.normal, adsLimit: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-gray-400">Normal Ads Reward</label>
          <input type="number" value={values.normal?.reward ?? 1} onChange={e => setValues({...values, normal: {...values.normal, reward: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-yellow-400">VIP Ads Daily Limit</label>
          <input type="number" value={values.vip?.adsLimit ?? 20} onChange={e => setValues({...values, vip: {...values.vip, adsLimit: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-yellow-400">VIP Ads Reward</label>
          <input type="number" value={values.vip?.reward ?? 2} onChange={e => setValues({...values, vip: {...values.vip, reward: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>`;

const newAdsFields = `<div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Normal Ads Daily Limit</label>
            <input type="number" value={values.normal?.adsLimit ?? 10} onChange={e => setValues({...values, normal: {...values.normal, adsLimit: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Normal Ads Reward</label>
            <input type="number" value={values.normal?.reward ?? 1} onChange={e => setValues({...values, normal: {...values.normal, reward: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-yellow-400">VIP Ads Daily Limit</label>
            <input type="number" value={values.vip?.adsLimit ?? 20} onChange={e => setValues({...values, vip: {...values.vip, adsLimit: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-yellow-400">VIP Ads Reward</label>
            <input type="number" value={values.vip?.reward ?? 2} onChange={e => setValues({...values, vip: {...values.vip, reward: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>`;

code = code.replace(oldAdsFields, newAdsFields);


const oldAdsTimerFields = `<div>
          <label className="block text-sm mb-1 text-blue-400">Ads Timer (Seconds)</label>
          <input type="number" value={values.settings?.adsSecond ?? 10} onChange={e => setValues({...values, settings: {...values.settings, adsSecond: parseInt(e.target.value) || 0}})} placeholder="e.g. 10" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-green-400">Daily Bonus Amount</label>
          <input type="number" value={values.settings?.dailyBonus ?? 100} onChange={e => setValues({...values, settings: {...values.settings, dailyBonus: parseFloat(e.target.value) || 0}})} placeholder="e.g. 100" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>
        <div>
          <label className="block text-sm mb-1 text-purple-400">VA Token Mining (Per 24h)</label>
          <input type="number" value={values.settings?.miningRate ?? 50} onChange={e => setValues({...values, settings: {...values.settings, miningRate: parseFloat(e.target.value) || 0}})} placeholder="e.g. 50" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>`;

const newAdsTimerFields = `<div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-blue-400">Ads Timer (Seconds)</label>
            <input type="number" value={values.settings?.adsSecond ?? 10} onChange={e => setValues({...values, settings: {...values.settings, adsSecond: parseInt(e.target.value) || 0}})} placeholder="e.g. 10" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Daily Bonus Amount</label>
            <input type="number" value={values.settings?.dailyBonus ?? 100} onChange={e => setValues({...values, settings: {...values.settings, dailyBonus: parseFloat(e.target.value) || 0}})} placeholder="e.g. 100" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-purple-400">VA Token Mining (Per 24h)</label>
            <input type="number" value={values.settings?.miningRate ?? 50} onChange={e => setValues({...values, settings: {...values.settings, miningRate: parseFloat(e.target.value) || 0}})} placeholder="e.g. 50" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw Referrals</label>
            <input type="number" value={values.settings?.minWithdrawRefer ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdrawRefer: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>`;

code = code.replace(oldAdsTimerFields, newAdsTimerFields);

const oldMinReferField = `<div>
          <label className="block text-sm mb-1 text-gray-400">Min Referrals for Withdraw</label>
          <input type="number" value={values.settings?.minWithdrawRefer ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdrawRefer: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>`;
code = code.replace(oldMinReferField, '');

fs.writeFileSync('src/pages/Admin.tsx', code);
