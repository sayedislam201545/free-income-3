const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const startIdx = code.indexOf('function CoinValuesEditor({');
const endIdx = code.indexOf('function AdsRewardsEditor({');

const newEditor = `function CoinValuesEditor({ onClose, onSave }: any) {
  const [activeTab, setActiveTab] = useState("bdt");
  const [values, setValues] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoc(doc(db, "settings", "coin_values")).then(snap => {
      if (snap.exists()) setValues(snap.data());
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Edit Coin Values</h2>
        <button onClick={onClose}><X/></button>
      </div>

      <div className="flex space-x-2 border-b border-white/10 pb-2">
        <button onClick={() => setActiveTab('bdt')} className={\`px-4 py-2 text-sm font-bold rounded \${activeTab === 'bdt' ? 'bg-blue-600 text-white' : 'text-gray-400'}\`}>BDT Values (৳)</button>
        <button onClick={() => setActiveTab('crypto')} className={\`px-4 py-2 text-sm font-bold rounded \${activeTab === 'crypto' ? 'bg-blue-600 text-white' : 'text-gray-400'}\`}>Crypto Values ($)</button>
      </div>

      {activeTab === 'bdt' && (
        <div className="space-y-4 animate-in fade-in">
           <div>
             <label className="block text-sm mb-1 text-gray-400">1 VA to TK (bKash/Nagad/Rocket etc)</label>
             <div className="flex items-center space-x-2">
               <span className="text-xl font-bold">৳</span>
               <input type="number" step="any" value={values.bdtRate || values.bKash || 1} onChange={e => setValues({...values, bdtRate: parseFloat(e.target.value) || 0, bKash: parseFloat(e.target.value) || 0})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl focus:border-blue-500 focus:outline-none" />
             </div>
           </div>
        </div>
      )}

      {activeTab === 'crypto' && (
        <div className="space-y-4 animate-in fade-in">
           <div>
             <label className="block text-sm mb-1 text-gray-400">1 VA to USD (Crypto)</label>
             <div className="flex items-center space-x-2">
               <span className="text-xl font-bold">$</span>
               <input type="number" step="any" value={values.cryptoRate || 1} onChange={e => setValues({...values, cryptoRate: parseFloat(e.target.value) || 0})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl focus:border-blue-500 focus:outline-none" />
             </div>
           </div>
        </div>
      )}

      <button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>
    </div>
  );
}
`;

code = code.substring(0, startIdx) + newEditor + code.substring(endIdx);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Fixed Admin");
