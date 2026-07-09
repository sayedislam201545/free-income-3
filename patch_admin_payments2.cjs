const fs = require('fs');
let lines = fs.readFileSync('src/pages/Admin.tsx', 'utf8').split('\n');

const replacementCode = `function AdminPayments() {
  const [methods, setMethods] = useState<any>({ deposit: [], withdraw: [] });
  const [activeType, setActiveType] = useState<"deposit" | "withdraw" | "requests" | "add_deposit" | "add_withdraw">("deposit");
  const [isEditing, setIsEditing] = useState<any>(null);
  const [currencyType, setCurrencyType] = useState<"Tk" | "Crypto">("Tk");
  
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    photo: "",
    address: "",
    isCrypto: false
  });

  useEffect(() => {
    const fetchMethods = async () => {
      const docRef = doc(db, "settings", "payment_methods");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setMethods(snap.data());
      } else {
        const defaultMethods = {
          deposit: [],
          withdraw: []
        };
        await setDoc(docRef, defaultMethods);
        setMethods(defaultMethods);
      }
    };
    fetchMethods();
  }, []);

  const handleSaveMethod = async (typeStr: "deposit" | "withdraw") => {
    if (!editData.name) {
      alert("Name is required");
      return;
    }
    if (typeStr === "deposit" && !editData.address) {
       alert("Payment Address/Number is required for deposit methods");
       return;
    }
    
    try {
      const newMethods = { ...methods };
      if (!newMethods[typeStr]) newMethods[typeStr] = [];
      
      const toSave = { ...editData, isCrypto: currencyType === "Crypto" };
      
      if (isEditing) {
        newMethods[typeStr] = newMethods[typeStr].map((m: any) => m.id === toSave.id ? toSave : m);
      } else {
        newMethods[typeStr].push({ ...toSave, id: Date.now().toString() });
      }
      
      await setDoc(doc(db, "settings", "payment_methods"), newMethods);
      setMethods(newMethods);
      
      alert("Method saved successfully!");
      setEditData({ id: "", name: "", photo: "", address: "", isCrypto: false });
      setIsEditing(null);
      setActiveType(typeStr);
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const newMethods = { ...methods };
      newMethods[type] = newMethods[type].filter((m: any) => m.id !== id);
      await setDoc(doc(db, "settings", "payment_methods"), newMethods);
      setMethods(newMethods);
    } catch (e) {
      console.error(e);
      alert("Failed to delete");
    }
  };
  
  const handleEditMethod = (m: any, type: string) => {
     setIsEditing(m.id);
     setEditData(m);
     setCurrencyType(m.isCrypto ? "Crypto" : "Tk");
     setActiveType(type === "deposit" ? "add_deposit" : "add_withdraw");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Payments & Requests</h2>
      </div>
      
      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl overflow-x-auto w-full mb-6 no-scrollbar">
        <button
          onClick={() => { setActiveType("deposit"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Deposit Methods
        </button>
        <button
          onClick={() => { setActiveType("withdraw"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Withdraw Methods
        </button>
        <button
          onClick={() => { setActiveType("requests"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "requests" ? "bg-red-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Requests
        </button>
        <button
          onClick={() => { setActiveType("add_withdraw"); setIsEditing(null); setEditData({ id: "", name: "", photo: "", address: "", isCrypto: false }); setCurrencyType("Tk"); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "add_withdraw" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Add Withdraw Methods
        </button>
        <button
          onClick={() => { setActiveType("add_deposit"); setIsEditing(null); setEditData({ id: "", name: "", photo: "", address: "", isCrypto: false }); setCurrencyType("Tk"); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "add_deposit" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Add Deposit Methods
        </button>
      </div>

      {activeType === "requests" && <AdminRequests />}
      
      {(activeType === "deposit" || activeType === "withdraw") && (
        <div className="space-y-4">
           {methods[activeType]?.map((m: any) => (
              <div key={m.id} className="bg-[#151A23] rounded-2xl p-4 flex items-center justify-between border border-white/5">
                 <div className="flex items-center space-x-4">
                    {m.photo && <img src={m.photo} alt={m.name} className="w-10 h-10 rounded-full bg-white/5 object-cover" />}
                    <div>
                       <h3 className="font-bold text-white">{m.name} {m.isCrypto && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded ml-2">Crypto</span>}</h3>
                       <p className="text-xs text-gray-400">{m.address}</p>
                    </div>
                 </div>
                 <div className="flex space-x-2">
                    <button onClick={() => handleEditMethod(m, activeType)} className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-xs font-bold hover:bg-blue-600 hover:text-white">Edit</button>
                    <button onClick={() => handleDelete(m.id, activeType)} className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-600 hover:text-white">Delete</button>
                 </div>
              </div>
           ))}
           {(!methods[activeType] || methods[activeType].length === 0) && (
              <div className="text-gray-500 py-10 text-center border border-dashed border-white/10 rounded-2xl">No methods found</div>
           )}
        </div>
      )}

      {(activeType === "add_withdraw" || activeType === "add_deposit") && (
        <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl max-w-xl animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-white text-lg mb-6">{isEditing ? "Edit Method" : \`Add New \${activeType === "add_withdraw" ? "Withdraw" : "Deposit"} Method\`}</h3>
          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Method Name</label>
                <input type="text" placeholder="e.g. bKash / Binance" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
             </div>
             
             <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Icon URL</label>
                <input type="text" placeholder="https://..." value={editData.photo} onChange={(e) => setEditData({...editData, photo: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
             </div>

             {activeType === "add_deposit" && (
               <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Payment Number & Address</label>
                  <input type="text" placeholder="e.g. 017XXXXXXXX / Wallet Address" value={editData.address} onChange={(e) => setEditData({...editData, address: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
               </div>
             )}

             <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Select Option (Crypto or Tk)</label>
                <select value={currencyType} onChange={(e) => setCurrencyType(e.target.value as "Tk" | "Crypto")} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500">
                  <option value="Tk">Tk (Fiat)</option>
                  <option value="Crypto">Crypto</option>
                </select>
             </div>

             <div className="pt-4 flex space-x-3">
               <button onClick={() => handleSaveMethod(activeType === "add_withdraw" ? "withdraw" : "deposit")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl font-bold shadow-lg">Save Method</button>
               {isEditing && <button onClick={() => { setIsEditing(null); setActiveType(activeType === "add_withdraw" ? "withdraw" : "deposit"); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 transition-colors text-white rounded-xl font-bold">Cancel</button>}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}`;

lines.splice(2738, 2956 - 2738 + 1, replacementCode);

fs.writeFileSync('src/pages/Admin.tsx', lines.join('\n'));
