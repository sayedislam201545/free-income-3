const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldSettings = `        <div>
          <label className="block text-sm mb-1 text-purple-400">VA Token Mining (Per 24h)</label>
          <input type="number" value={values.settings?.miningRate ?? 50} onChange={e => setValues({...values, settings: {...values.settings, miningRate: parseFloat(e.target.value) || 0}})} placeholder="e.g. 50" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>`;

const newSettings = `        <div>
          <label className="block text-sm mb-1 text-purple-400">VA Token Mining (Per 24h)</label>
          <input type="number" value={values.settings?.miningRate ?? 50} onChange={e => setValues({...values, settings: {...values.settings, miningRate: parseFloat(e.target.value) || 0}})} placeholder="e.g. 50" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
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
        <div>
          <label className="block text-sm mb-1 text-gray-400">Min Referrals for Withdraw</label>
          <input type="number" value={values.settings?.minWithdrawRefer ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdrawRefer: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
        </div>
        <hr className="border-white/10 my-4" />
        <h3 className="font-bold text-lg">Referral Bonus Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Referrer Bonus</label>
            <input type="number" value={values.settings?.userReferBonus ?? 250} onChange={e => setValues({...values, settings: {...values.settings, userReferBonus: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">New User Bonus</label>
            <input type="number" value={values.settings?.newUserReferBonus ?? 100} onChange={e => setValues({...values, settings: {...values.settings, newUserReferBonus: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>`;

code = code.replace(oldSettings, newSettings);
fs.writeFileSync('src/pages/Admin.tsx', code);
