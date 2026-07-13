const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Rename "Payment Methods" to "Resources" in sidebar and remove "Task Manager", "Task Submissions", "Achievements" from sidebar
content = content.replace('{ name: "Task Manager", icon: ListTodo, path: "/admin/tasks" },', '');
content = content.replace(/\{\s*name:\s*"Task Submissions"[\s\S]*?path:\s*"\/admin\/submissions",\s*\},/, '');
content = content.replace('{ name: "Achievements", icon: Trophy, path: "/admin/achievements" },', '');
content = content.replace('name: "Payment Methods"', 'name: "Resources"');

// 2. We need to replace AdminPayments component completely
const paymentsRegex = /function AdminPayments\(\) \{[\s\S]*?\}\s*function AdminRequests\(\) \{/m;
const newPayments = `function AdminPayments() {
  const [methods, setMethods] = useState<any>({ deposit: [], withdraw: [] });
  const [activeType, setActiveType] = useState<"deposit" | "withdraw" | "requests" | "tasks" | "achievements">("deposit");
  const [subTab, setSubTab] = useState<"old" | "add">("old");
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

  const handleSaveMethod = async (type: string) => {
    try {
      const newMethods = { ...methods };
      if (!newMethods[type]) newMethods[type] = [];
      
      if (isEditing) {
        newMethods[type] = newMethods[type].map((m: any) => m.id === isEditing ? { ...editData, isCrypto: currencyType === "Crypto" } : m);
      } else {
        newMethods[type].push({
          ...editData,
          id: Date.now().toString(),
          isCrypto: currencyType === "Crypto"
        });
      }
      
      await setDoc(doc(db, "settings", "payment_methods"), newMethods);
      setMethods(newMethods);
      setIsEditing(null);
      setEditData({ id: "", name: "", photo: "", address: "", isCrypto: false });
      setSubTab("old");
      alert("Method saved!");
    } catch (e) {
      console.error(e);
      alert("Failed to save");
    }
  };
  
  const handleDelete = async (id: string, type: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const newMethods = { ...methods };
      newMethods[type] = newMethods[type].filter((m: any) => m.id && m.id.toString() !== id.toString());
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
     setActiveType(type as any);
     setSubTab("add");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Resources</h2>
      </div>
      
      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl overflow-x-auto w-full mb-6 no-scrollbar">
        <button
          onClick={() => { setActiveType("deposit"); setIsEditing(null); setSubTab("old"); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Deposit Methods
        </button>
        <button
          onClick={() => { setActiveType("withdraw"); setIsEditing(null); setSubTab("old"); }}
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
          onClick={() => { setActiveType("tasks"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "tasks" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Task Management
        </button>
        <button
          onClick={() => { setActiveType("achievements"); setIsEditing(null); }}
          className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "achievements" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Achievements
        </button>
      </div>

      {activeType === "tasks" && <AdminTasks />}
      {activeType === "achievements" && <AdminAchievements />}
      {activeType === "requests" && <AdminRequests />}
      
      {(activeType === "deposit" || activeType === "withdraw") && (
        <div className="space-y-4">
           <div className="flex space-x-2 mb-4 bg-[#151A23] p-1.5 rounded-xl border border-white/5 w-fit">
             <button
               onClick={() => { setSubTab("add"); setEditData({ id: "", name: "", photo: "", address: "", isCrypto: false }); setIsEditing(null); setCurrencyType("Tk"); }}
               className={\`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all \${subTab === "add" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
             >
               {activeType === "deposit" ? "Add Deposit Methods" : "Add Withdraw Methods"}
             </button>
             <button
               onClick={() => setSubTab("old")}
               className={\`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all \${subTab === "old" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
             >
               {activeType === "deposit" ? "Old Deposit Methods" : "Old Withdraw Methods"}
             </button>
           </div>

           {subTab === "old" && (
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

           {subTab === "add" && (
              <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl max-w-xl animate-in fade-in slide-in-from-bottom-4">
                <h3 className="font-bold text-white text-lg mb-6">{isEditing ? "Edit Method" : \`Add New \${activeType === "withdraw" ? "Withdraw" : "Deposit"} Method\`}</h3>
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Method Name</label>
                      <input type="text" placeholder="e.g. bKash / Binance" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1">Icon URL</label>
                      <input type="text" placeholder="https://..." value={editData.photo} onChange={(e) => setEditData({...editData, photo: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500" />
                   </div>

                   {activeType === "deposit" && (
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
                     <button onClick={() => handleSaveMethod(activeType === "withdraw" ? "withdraw" : "deposit")} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 transition-colors text-white rounded-xl font-bold shadow-lg">Save Method</button>
                     {isEditing && <button onClick={() => { setIsEditing(null); setSubTab("old"); }} className="flex-1 py-3 bg-white/5 hover:bg-white/10 transition-colors text-white rounded-xl font-bold">Cancel</button>}
                   </div>
                </div>
              </div>
           )}
        </div>
      )}
    </div>
  );
}

function AdminRequests() {`;

content = content.replace(paymentsRegex, newPayments);

// 3. Replace AdminRequests component
const requestsRegex = /function AdminRequests\(\) \{[\s\S]*?\}\s*function AdminBotSettings\(\) \{/m;
const newRequests = `function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<"deposit" | "withdraw" | "submissions">("deposit");
  const [activeStatus, setActiveStatus] = useState<"pending" | "completed" | "rejected">("pending");

  useEffect(() => {
    const reqsRef = collection(db, "transactions");
    const unsubscribe = onSnapshot(reqsRef, (snapshot) => {
      if (!snapshot.empty) {
        const arr: any[] = [];
        snapshot.docs.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.type === "deposit" || data.type === "withdraw") {
            arr.push({ id: docSnap.id, ...data });
          }
        });
        arr.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setRequests(arr);
      } else {
        setRequests([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const filteredReqs = requests.filter(
    (r) => r.type === activeType && (r.status || "pending") === activeStatus,
  );

  const handleStatusUpdate = async (req: any, newStatus: string) => {
    try {
      await updateDoc(doc(db, "transactions", req.id), { status: newStatus });
      if (req.type === "deposit" && newStatus === "completed" && req.userId) {
        const userRef = doc(db, "users", req.userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          await updateDoc(userRef, {
            vaBalance: (userData.vaBalance || 0) + (req.amount || 0),
          });
        }
      }
      alert("Status updated!");
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-2 bg-[#151A23] p-1.5 rounded-xl border border-white/5 w-fit overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setActiveType("deposit")}
            className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveType("withdraw")}
            className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setActiveType("submissions")}
            className={\`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all \${activeType === "submissions" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
          >
            Task Submissions
          </button>
        </div>
        {activeType !== "submissions" && (
          <div className="flex space-x-2 bg-[#151A23] p-1.5 rounded-xl border border-white/5 w-fit">
            <button
              onClick={() => setActiveStatus("pending")}
              className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${activeStatus === "pending" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "text-gray-400 hover:text-white border border-transparent"}\`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveStatus("completed")}
              className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${activeStatus === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-400 hover:text-white border border-transparent"}\`}
            >
              Approved
            </button>
            <button
              onClick={() => setActiveStatus("rejected")}
              className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${activeStatus === "rejected" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-gray-400 hover:text-white border border-transparent"}\`}
            >
              Rejected
            </button>
          </div>
        )}
      </div>
      
      {activeType === "submissions" ? (
        <AdminSubmissions />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReqs.map((req) => (
            <div
              key={req.id}
              className="bg-[#151A23] rounded-2xl border border-white/5 p-5 shadow-lg relative overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {req.username || req.userId.substring(0, 8)}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(req.timestamp).toLocaleString()}
                  </p>
                </div>
                <span className={\`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider \${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : req.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}\`}>
                  {req.status || "pending"}
                </span>
              </div>
              <div className="bg-[#0B0E14] rounded-xl p-3 mb-4 flex-1">
                <p className="text-sm font-bold text-gray-200 mb-1">
                  Amount: {req.amount} {req.currency || "Coins"}
                </p>
                <p className="text-xs text-blue-400 font-bold mb-2">
                  Method: {req.methodName}
                </p>
                <div className="text-xs text-gray-400 break-all">
                  <span className="text-gray-500">Address/Account:</span> {req.address}
                </div>
              </div>
              {req.status === "pending" && (
                <div className="flex space-x-2 mt-auto">
                  <button
                    onClick={() => handleStatusUpdate(req, "completed")}
                    className="flex-1 bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white py-2 rounded-lg font-bold text-xs transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(req, "rejected")}
                    className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white py-2 rounded-lg font-bold text-xs transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminBotSettings() {`;

content = content.replace(requestsRegex, newRequests);

fs.writeFileSync('src/pages/Admin.tsx', content);
console.log("Updated Admin.tsx");
