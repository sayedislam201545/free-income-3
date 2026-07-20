const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldCode = `  return <div>Admin Requests</div>;`;

const newCode = `
  const filteredRequests = requests.filter(r => r.type === activeType && r.status === activeStatus);

  const handleUpdateStatus = async (id: string, newStatus: string, r: any) => {
    try {
      await updateDoc(doc(db, "transactions", id), { status: newStatus });
      if (r.type === "withdraw" && newStatus === "rejected") {
         const userRef = doc(db, "users", r.userId);
         const uSnap = await getDoc(userRef);
         if (uSnap.exists()) {
             // refund
             const uData = uSnap.data();
             await updateDoc(userRef, { vaBalance: (uData.vaBalance || 0) + (r.amount || 0) });
         }
      }
      if (r.type === "deposit" && newStatus === "completed") {
         const userRef = doc(db, "users", r.userId);
         const uSnap = await getDoc(userRef);
         if (uSnap.exists()) {
             const uData = uSnap.data();
             await updateDoc(userRef, { vaBalance: (uData.vaBalance || 0) + (r.amount || 0) });
         }
      }
      useUIStore.getState().addToast(\`Request \${newStatus}\`);
    } catch (e) {
      console.error(e);
      useUIStore.getState().addToast("Error updating request");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-tight">Requests Management</h2>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-4 w-fit">
        {["deposit", "withdraw"].map(t => (
          <button
            key={t}
            onClick={() => setActiveType(t as any)}
            className={\`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all \${activeType === t ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}\`}
          >
            {t}s
          </button>
        ))}
      </div>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl overflow-x-auto no-scrollbar">
        {["pending", "completed", "rejected"].map(s => (
          <button
            key={s}
            onClick={() => setActiveStatus(s as any)}
            className={\`flex-1 py-2 rounded-lg font-bold text-sm capitalize transition-all \${activeStatus === s ? "bg-[#252D3D] text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[#151A23] rounded-2xl border border-white/5 p-4 space-y-4">
         {filteredRequests.length === 0 ? (
           <p className="text-gray-400 text-center py-4">No {activeStatus} {activeType} requests found.</p>
         ) : (
           filteredRequests.map(r => (
             <div key={r.id} className="bg-[#0B0E14] border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
               <div>
                 <p className="font-bold text-white mb-1">User: {r.userId}</p>
                 <p className="text-sm text-gray-400 mb-1">Amount: <span className="font-bold text-yellow-400">{r.amount} VA</span></p>
                 <p className="text-xs text-gray-500">Method: {r.method}</p>
                 {r.details && <p className="text-xs text-gray-500 mt-1">Details: {r.details}</p>}
                 {r.proofUrl && (
                   <a href={r.proofUrl} target="_blank" rel="noreferrer" className="text-blue-400 text-xs mt-2 inline-block">View Proof</a>
                 )}
               </div>
               {activeStatus === "pending" && (
                 <div className="flex space-x-2">
                   <button onClick={() => handleUpdateStatus(r.id, "completed", r)} className="px-4 py-2 bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white rounded-lg text-sm font-bold transition-colors">
                     Approve
                   </button>
                   <button onClick={() => handleUpdateStatus(r.id, "rejected", r)} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-sm font-bold transition-colors">
                     Reject
                   </button>
                 </div>
               )}
             </div>
           ))
         )}
      </div>
    </div>
  );
`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/pages/Admin.tsx', code);
