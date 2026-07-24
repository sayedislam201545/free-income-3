const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const targetSettings = `<h3 className="font-bold text-lg">General Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-green-400">BDT Values (৳)</label>
            <input type="number" step="any" value={values.coinValues?.bdtRate || values.coinValues?.bKash || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, bdtRate: parseFloat(e.target.value) || 0, bKash: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Crypto Values ($)</label>
            <input type="number" step="any" value={values.coinValues?.cryptoRate || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, cryptoRate: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
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
        </div>
        
        <hr className="border-white/10 my-4" />

        <h3 className="font-bold text-lg">Financial Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw</label>
            <input type="number" value={values.settings?.minWithdraw ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdraw: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Max Withdraw</label>
            <input type="number" value={values.settings?.maxWithdraw ?? 0} onChange={e => setValues({...values, settings: {...values.settings, maxWithdraw: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Deposit</label>
            <input type="number" value={values.settings?.minDeposit ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minDeposit: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Max Deposit</label>
            <input type="number" value={values.settings?.maxDeposit ?? 0} onChange={e => setValues({...values, settings: {...values.settings, maxDeposit: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>`;

const replacementSettings = `<h3 className="font-bold text-lg">General Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-green-400">BDT Values (৳)</label>
            <input type="number" step="any" value={values.coinValues?.bdtRate || values.coinValues?.bKash || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, bdtRate: parseFloat(e.target.value) || 0, bKash: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Crypto Values ($)</label>
            <input type="number" step="any" value={values.coinValues?.cryptoRate || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, cryptoRate: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-blue-400">Ads Timer (Seconds)</label>
            <input type="number" value={values.settings?.adsSecond ?? 10} onChange={e => setValues({...values, settings: {...values.settings, adsSecond: parseInt(e.target.value) || 0}})} placeholder="e.g. 10" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Daily Bonus Amount</label>
            <input type="number" value={values.settings?.dailyBonus ?? 100} onChange={e => setValues({...values, settings: {...values.settings, dailyBonus: parseFloat(e.target.value) || 0}})} placeholder="e.g. 100" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1 text-purple-400">VA Token Mining (Per 24h)</label>
            <input type="number" value={values.settings?.miningRate ?? 50} onChange={e => setValues({...values, settings: {...values.settings, miningRate: parseFloat(e.target.value) || 0}})} placeholder="e.g. 50" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        
        <hr className="border-white/10 my-4" />

        <h3 className="font-bold text-lg">Financial Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw</label>
            <input type="number" value={values.settings?.minWithdraw ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdraw: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Max Withdraw</label>
            <input type="number" value={values.settings?.maxWithdraw ?? 0} onChange={e => setValues({...values, settings: {...values.settings, maxWithdraw: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Deposit</label>
            <input type="number" value={values.settings?.minDeposit ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minDeposit: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Max Deposit</label>
            <input type="number" value={values.settings?.maxDeposit ?? 0} onChange={e => setValues({...values, settings: {...values.settings, maxDeposit: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw Referrals</label>
            <input type="number" value={values.settings?.minWithdrawRefer ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdrawRefer: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>`;

code = code.replace(targetSettings, replacementSettings);
fs.writeFileSync('src/pages/Admin.tsx', code);
