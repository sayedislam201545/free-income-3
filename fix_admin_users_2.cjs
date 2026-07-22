const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const startIdx = code.indexOf('function AdminUsers() {');
const endIdx = code.indexOf('function AdminAchievements() {');

let newAdminUsers = `function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState<string>("");
  const [balanceOperation, setBalanceOperation] = useState<"" | "add" | "subtract">("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const arr: any[] = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setUsers(arr);
    });
    return () => unsub();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      useUIStore.getState().addToast("User role updated");
    } catch(e) {
      useUIStore.getState().addToast("Error updating role", "error");
    }
  }

  const handleUpdateStatus = async (userId: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { status: currentStatus === "banned" ? "active" : "banned" });
      useUIStore.getState().addToast(currentStatus === "banned" ? "User Unbanned" : "User Banned");
    } catch(e) {
      useUIStore.getState().addToast("Error updating status", "error");
    }
  }

  const handleUpdateBalance = async () => {
    if (!selectedUser || !balanceOperation) return;
    try {
      const parsed = parseFloat(newBalance);
      if (isNaN(parsed) || parsed <= 0) {
        useUIStore.getState().addToast("Enter a valid amount", "error");
        return;
      }
      const amount = balanceOperation === 'add' ? parsed : -parsed;
      await updateDoc(doc(db, "users", selectedUser.id), { vaBalance: (selectedUser.vaBalance || 0) + amount });
      useUIStore.getState().addToast(\`Balance \${balanceOperation === 'add' ? 'increased' : 'decreased'} by \${parsed}\`);
      setNewBalance("");
      setBalanceOperation("");
    } catch(e) {
      useUIStore.getState().addToast("Error updating balance", "error");
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user completely?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        useUIStore.getState().addToast("User deleted");
        setSelectedUser(null);
      } catch(e) {
        useUIStore.getState().addToast("Error deleting user", "error");
      }
    }
  }

  const getFullName = (u: any) => {
    if (u.fullName) return u.fullName;
    const name = \`\${u.firstName || ''} \${u.lastName || ''}\`.trim();
    return name || u.name || "Unknown";
  };

  const filtered = users.filter(u => 
    getFullName(u).toLowerCase().includes(search.toLowerCase()) || 
    (u.telegramId || "").toString().includes(search) ||
    (u.username || "").toLowerCase().includes(search.toLowerCase())
  );

  // Auto-update selected user from the live list
  useEffect(() => {
    if (selectedUser) {
      const liveUser = users.find(u => u.id === selectedUser.id);
      if (liveUser) {
        setSelectedUser(liveUser);
      } else {
        setSelectedUser(null); // User was deleted
      }
    }
  }, [users]);

  const formatShortNumber = (num: number) => {
    if (typeof num !== 'number' || isNaN(num)) return '0.00';
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\\.0$/, '') + 'M';
    if (num >= 10000) return (num / 1000).toFixed(1).replace(/\\.0$/, '') + 'k';
    return num.toFixed(2);
  };

  if (selectedUser) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 pb-10">
        <div className="flex items-center space-x-3 mb-6">
          <button onClick={() => { setSelectedUser(null); setBalanceOperation(""); setNewBalance(""); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold">User Details</h2>
        </div>

        {/* 1st Box: Profile Info */}
        <div className="bg-[#151A23] border border-white/10 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 rounded-full bg-[#0B0E14] border-4 border-[#1C2331] shadow-xl overflow-hidden shrink-0 flex items-center justify-center">
              {selectedUser.photoUrl ? (
                <img src={selectedUser.photoUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <h3 className="text-2xl font-black text-white">{getFullName(selectedUser)}</h3>
              <p className="text-gray-400 text-sm font-medium">@{selectedUser.username || "no_username"}</p>
              <div className="inline-flex items-center space-x-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">ID</span>
                <span className="text-sm text-white font-mono">{selectedUser.telegramId || selectedUser.id}</span>
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 pt-2">
                <span className={\`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider \${selectedUser.status === 'banned' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}\`}>
                  {selectedUser.status === 'banned' ? 'Banned' : 'Normal'}
                </span>
                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400">
                  {selectedUser.role === 'admin' || selectedUser.role === 'super_admin' ? 'Admin' : (selectedUser.role === 'vip' ? 'VIP' : 'User')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2nd Box: Stats (2 items per row) */}
        <div className="bg-[#151A23] border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><Trophy className="w-4 h-4 mr-2" /> Statistics</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Balance</span>
              <span className="text-xl font-black text-green-400">{formatShortNumber(selectedUser.vaBalance || 0)} VA</span>
            </div>
            <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Referrals</span>
              <span className="text-xl font-black text-white">{selectedUser.referralsCount || 0}</span>
            </div>
            <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Tasks</span>
              <span className="text-xl font-black text-white">{selectedUser.tasksCompleted || 0}</span>
            </div>
            <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Ads Watched</span>
              <span className="text-xl font-black text-white">{selectedUser.adsWatchedTotal || 0}</span>
            </div>
            <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">Global Rank</span>
              <span className="text-xl font-black text-orange-400">#{selectedUser.rank || 'N/A'}</span>
            </div>
            <div className="bg-[#0B0E14] border border-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">User Level</span>
              <span className="text-xl font-black text-purple-400">Lv {selectedUser.level || 1}</span>
            </div>
          </div>
        </div>

        {/* 3rd Box: Actions */}
        <div className="bg-[#151A23] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center"><Settings className="w-4 h-4 mr-2" /> Actions</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Role Management</label>
              <select 
                value={selectedUser.role || "user"}
                onChange={(e) => handleUpdateRole(selectedUser.id, e.target.value)}
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="user">User</option>
                <option value="vip">VIP</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="pt-4 border-t border-white/5">
              <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Coin Balance Update (+ / -)</label>
              <select
                value={balanceOperation}
                onChange={(e) => { setBalanceOperation(e.target.value as any); setNewBalance(""); }}
                className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors mb-3"
              >
                <option value="">Select Operation...</option>
                <option value="add">Add Coins (+)</option>
                <option value="subtract">Subtract Coins (-)</option>
              </select>
              
              {balanceOperation && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                  <input 
                    type="number" 
                    step="any"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    placeholder="Enter amount to update..."
                    className="w-full bg-[#0B0E14] border border-blue-500/30 rounded-xl p-3 text-white font-medium focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <button 
                    onClick={handleUpdateBalance} 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                  >
                    Update Balance
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
               <button 
                 onClick={() => handleUpdateStatus(selectedUser.id, selectedUser.status)}
                 className={\`py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg \${selectedUser.status === 'banned' ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-900/20' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20'}\`}
               >
                 <div className="flex items-center justify-center space-x-2"><Ban className="w-4 h-4"/> <span>{selectedUser.status === 'banned' ? 'Unban User' : 'Ban User'}</span></div>
               </button>

               <button 
                 onClick={() => handleDeleteUser(selectedUser.id)}
                 className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg shadow-red-900/20"
               >
                 <div className="flex items-center justify-center space-x-2"><Trash2 className="w-4 h-4"/> <span>Delete User</span></div>
               </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Users Management</h2>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by name, username or ID..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#151A23] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all shadow-lg"
          />
          <Users className="w-5 h-5 text-gray-500 absolute left-3 top-3.5" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filtered.map(u => (
          <div key={u.id} className="bg-[#151A23] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-white/20 transition-all">
            <div className="flex items-center space-x-4 min-w-0">
               <div className="w-12 h-12 rounded-full bg-[#0B0E14] border border-white/5 shrink-0 overflow-hidden flex items-center justify-center">
                  {u.photoUrl ? <img src={u.photoUrl} alt="" className="w-full h-full object-cover"/> : <User className="w-5 h-5 text-gray-500" />}
               </div>
               <div className="min-w-0">
                 <h3 className="font-bold text-white truncate text-base">{getFullName(u)}</h3>
                 <p className="text-xs text-gray-400 truncate">@{u.username || "no_username"}</p>
                 {u.status === 'banned' && <span className="inline-block mt-1 bg-red-500/20 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Banned</span>}
               </div>
            </div>
            <button 
              onClick={() => setSelectedUser(u)} 
              className="ml-4 shrink-0 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-900/20"
            >
              GO
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 bg-[#151A23] border border-white/10 rounded-2xl">
            <Users className="w-10 h-10 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
}
`;

code = code.substring(0, startIdx) + newAdminUsers + '\n\n' + code.substring(endIdx);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Admin Users fixed");
