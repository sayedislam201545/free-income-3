const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /function AdminUsers\(\) \{[\s\S]*?const filtered = users\.filter\([\s\S]*?\);/;

const newUsers = `function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [newBalance, setNewBalance] = useState<string>("");

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
    if (!editingUser) return;
    try {
      const parsed = parseFloat(newBalance);
      if (isNaN(parsed)) return;
      await updateDoc(doc(db, "users", editingUser.id), { vaBalance: parsed });
      useUIStore.getState().addToast("Balance updated");
      setEditingUser(null);
    } catch(e) {
      useUIStore.getState().addToast("Error updating balance", "error");
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user completely?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        useUIStore.getState().addToast("User deleted");
      } catch(e) {
        useUIStore.getState().addToast("Error deleting user", "error");
      }
    }
  }

  const filtered = users.filter(u => 
    (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.telegramId || "").toString().includes(search)
  );`;

if (code.match(regex)) {
   code = code.replace(regex, newUsers);
   console.log("AdminUsers logic patched.");
}

const renderRegex = /<th className="p-3">Role<\/th>[\s\S]*?<\/tr>[\s\S]*?<\/thead>[\s\S]*?<tbody>[\s\S]*?\{filtered\.map\(u => \([\s\S]*?<td className="p-3">[\s\S]*?<select[\s\S]*?<\/select>[\s\S]*?<\/td>[\s\S]*?<\/tr>/;

const newRender = `<th className="p-3">Role</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="p-3">
                  <div className="font-bold text-white flex items-center space-x-2">
                     <span>{u.name || "Unknown"}</span>
                     {u.status === "banned" && <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded uppercase">Banned</span>}
                  </div>
                  <div className="text-xs text-gray-500">@{u.username || "no_username"}</div>
                </td>
                <td className="p-3 text-white font-mono text-xs">{u.telegramId}</td>
                <td className="p-3 font-bold text-green-400">{u.vaBalance || 0} VA</td>
                <td className="p-3">
                  <select 
                    value={u.role || "user"}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="bg-[#0B0E14] border border-white/10 rounded p-1 text-xs text-white"
                  >
                    <option value="user">User</option>
                    <option value="vip">VIP</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-3 flex justify-end space-x-2">
                   <button onClick={() => { setEditingUser(u); setNewBalance(u.vaBalance?.toString() || "0"); }} className="p-1.5 bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white rounded transition-colors" title="Edit Balance"><Coins className="w-4 h-4"/></button>
                   <button onClick={() => handleUpdateStatus(u.id, u.status)} className={\`p-1.5 rounded transition-colors \${u.status === 'banned' ? 'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white' : 'bg-orange-500/20 text-orange-400 hover:bg-orange-500 hover:text-white'}\`} title={u.status === 'banned' ? 'Unban User' : 'Ban User'}><Ban className="w-4 h-4"/></button>
                   <button onClick={() => handleDeleteUser(u.id)} className="p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors" title="Delete User"><Trash2 className="w-4 h-4"/></button>
                </td>
              </tr>`;

if (code.match(renderRegex)) {
    code = code.replace(renderRegex, newRender);
    console.log("AdminUsers render patched.");
}

// Add the Edit Balance Modal
const modalRegex = /<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>\s*\);/;
const newModal = `</tbody>
          </table>
        </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#151A23] rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">Edit Balance for {editingUser.name}</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-1">Current Balance: {editingUser.vaBalance || 0} VA</label>
              <input type="number" step="any" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500" placeholder="Enter new balance" />
            </div>
            <div className="flex space-x-3">
               <button onClick={() => setEditingUser(null)} className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-bold transition-colors">Cancel</button>
               <button onClick={handleUpdateBalance} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );`;

code = code.replace(modalRegex, newModal);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("AdminUsers modal added.");

