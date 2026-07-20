const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /function AdminVIP\(\) \{[\s\S]*?\}\s*function AdminDashboard\(\) \{/;

const newCode = `function AdminVIP() {
  const [plans, setPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"added" | "add">("added");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "vip_plans"), (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setPlans(arr);
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!editingPlan) return;
    try {
      if (editingPlan.id) {
        await updateDoc(doc(db, "vip_plans", editingPlan.id), editingPlan);
      } else {
        await addDoc(collection(db, "vip_plans"), editingPlan);
      }
      useUIStore.getState().addToast("VIP Plan Saved!");
      setEditingPlan(null);
      setActiveTab("added");
    } catch (e) {
      useUIStore.getState().addToast("Error saving", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "vip_plans", id));
      useUIStore.getState().addToast("VIP Plan Deleted!");
    } catch (e) {
      useUIStore.getState().addToast("Error deleting", "error");
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">VIP Plans Management</h2>
      </div>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-4 w-fit">
        <button
          onClick={() => { setActiveTab("added"); setEditingPlan(null); }}
          className={\`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all \${activeTab === "added" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
        >
          Added
        </button>
        <button
          onClick={() => { setActiveTab("add"); setEditingPlan({ name: "", price: 0, durationDays: 30, features: [] }); }}
          className={\`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all \${activeTab === "add" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
        >
          Add
        </button>
      </div>

      {activeTab === "add" && editingPlan ? (
        <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-lg">{editingPlan.id ? "Edit Plan" : "Create Plan"}</h3>
          </div>
          <div className="space-y-4">
             <div><label className="text-xs text-gray-400">Plan Name</label><input type="text" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-400">Price (USDT)</label><input type="number" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
               <div><label className="text-xs text-gray-400">Duration (Days)</label><input type="number" value={editingPlan.durationDays} onChange={e => setEditingPlan({...editingPlan, durationDays: parseInt(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             </div>
             <div>
                <label className="text-xs text-gray-400">Features (comma separated)</label>
                <textarea value={editingPlan.features?.join(", ")} onChange={e => setEditingPlan({...editingPlan, features: e.target.value.split(",").map((s: string) => s.trim())})} className="w-full h-24 bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" />
             </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl">Save VIP Plan</button>
            <button onClick={() => { setEditingPlan(null); setActiveTab("added"); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(p => (
            <div key={p.id} className="bg-[#151A23] border border-white/5 rounded-xl p-6">
               <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
               <p className="text-yellow-400 font-bold mb-4">{p.price} USDT / {p.durationDays} days</p>
               <ul className="space-y-2 mb-6 text-sm text-gray-400">
                 {p.features?.map((f: string, i: number) => <li key={i}>• {f}</li>)}
               </ul>
               <div className="flex space-x-2">
                 <button onClick={() => { setEditingPlan(p); setActiveTab("add"); }} className="flex-1 bg-blue-500/20 text-blue-400 py-2 rounded-lg font-bold">Edit</button>
                 <button onClick={() => handleDelete(p.id)} className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg font-bold">Delete</button>
               </div>
            </div>
          ))}
          {plans.length === 0 && <p className="text-gray-500">No VIP plans found.</p>}
        </div>
      )}
    </div>
  );
}

function AdminDashboard() {`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/pages/Admin.tsx', code);
