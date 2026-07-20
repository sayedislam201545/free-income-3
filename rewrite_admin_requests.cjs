const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const adminReqStart = content.indexOf('function AdminRequests() {');
const adminReqEnd = content.indexOf('function CoinValuesEditor', adminReqStart);

const newAdminRequests = `function AdminRequests() {
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
        await updateDoc(doc(db, "users", req.userId), {
          vaBalance: increment(Number(req.amount || 0))
        });
      }
      useUIStore.getState().addToast(\`Request \${newStatus}\`, "success");
    } catch (error) {
      useUIStore.getState().addToast("Update failed", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl">
        <button onClick={() => setActiveType("deposit")} className={\`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all \${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Deposits</button>
        <button onClick={() => setActiveType("withdraw")} className={\`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all \${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Withdrawals</button>
        <button onClick={() => setActiveType("submissions")} className={\`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all \${activeType === "submissions" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}>Task Submissions</button>
      </div>

      {activeType === "submissions" ? (
        <AdminSubmissions />
      ) : (
        <>
          <div className="flex space-x-2">
            {["pending", "completed", "rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setActiveStatus(status as any)}
                className={\`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors \${activeStatus === status ? "bg-white text-[#151A23]" : "bg-white/5 text-gray-400 hover:text-white"}\`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="bg-[#151A23] rounded-2xl border border-white/5 overflow-hidden">
            {filteredReqs.length === 0 ? (
              <div className="p-8 text-center text-gray-500 font-medium">No {activeStatus} requests</div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredReqs.map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div>
                      <h4 className="font-bold text-white text-sm">{req.method || 'Unknown Method'}</h4>
                      <p className="text-xs text-gray-400 mt-1">{req.accountDetails || req.address || 'No details'}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{new Date(req.timestamp || Date.now()).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-lg text-white mb-2">{req.amount} VA</div>
                      {activeStatus === "pending" && (
                        <div className="flex space-x-2">
                          <button onClick={() => handleStatusUpdate(req, "completed")} className="px-3 py-1.5 bg-green-500/20 text-green-500 rounded-lg text-xs font-bold hover:bg-green-500 hover:text-white transition-colors">Approve</button>
                          <button onClick={() => handleStatusUpdate(req, "rejected")} className="px-3 py-1.5 bg-red-500/20 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                        </div>
                      )}
                      {activeStatus !== "pending" && (
                        <span className={\`text-xs font-bold px-2 py-1 rounded \${req.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}\`}>
                          {req.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

`;

content = content.slice(0, adminReqStart) + newAdminRequests + content.slice(adminReqEnd);
fs.writeFileSync('src/pages/Admin.tsx', content);
console.log('Successfully rewrote AdminRequests');
