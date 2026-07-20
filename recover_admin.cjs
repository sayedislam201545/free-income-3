const fs = require('fs');
let dashContent = fs.readFileSync('fix_admin_dash_2.cjs', 'utf8').split('`')[1];

let submissionsContent = fs.readFileSync('fix_submissions.cjs', 'utf8').split('`')[3];
if (!submissionsContent || !submissionsContent.includes('function AdminSubmissions')) {
    submissionsContent = fs.readFileSync('fix_submissions.cjs', 'utf8').split('`')[1];
}

let tasksContent = fs.readFileSync('tasks.txt', 'utf8');
if (tasksContent.startsWith('==AdminTasks==')) {
    tasksContent = tasksContent.replace('==AdminTasks==', '');
}

let achieveContent = fs.readFileSync('achieve.txt', 'utf8');
if (achieveContent.startsWith('==AdminAchievements==')) {
    achieveContent = achieveContent.replace('==AdminAchievements==', '');
}

let paymentsContent = fs.readFileSync('payments.txt', 'utf8');

// I will write AdminUsers here:
const usersContent = `
function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      const arr = [];
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
      setUsers(arr);
    });
    return () => unsub();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      useUIStore.getState().addToast("User role updated");
    } catch(e) {
      useUIStore.getState().addToast("Error updating role", "error");
    }
  }

  const filtered = users.filter(u => 
    (u.name || "").toLowerCase().includes(search.toLowerCase()) || 
    (u.telegramId || "").toString().includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <input 
          type="text" 
          placeholder="Search by name or ID..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="bg-[#151A23] border border-white/10 rounded-xl p-2 text-white"
        />
      </div>
      <div className="bg-[#151A23] border border-white/5 rounded-2xl p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-400 text-sm">
              <th className="p-3">User</th>
              <th className="p-3">Telegram ID</th>
              <th className="p-3">Balance (VA)</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="p-3">
                  <div className="font-bold text-white">{u.name || "Unknown"}</div>
                  <div className="text-xs text-gray-500">@{u.username || "no_username"}</div>
                </td>
                <td className="p-3 text-gray-300">{u.telegramId || u.id}</td>
                <td className="p-3 text-yellow-400 font-bold">{u.vaBalance || 0}</td>
                <td className="p-3">
                   <select 
                     value={u.role || "user"} 
                     onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                     className="bg-[#0B0E14] border border-white/10 rounded-lg p-1.5 text-xs text-white"
                   >
                     <option value="user">User</option>
                     <option value="vip">VIP</option>
                     <option value="admin">Admin</option>
                   </select>
                </td>
                <td className="p-3">
                  {/* Additional user actions can be placed here */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

const adminCode = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const finalCode = adminCode + "\n" + dashContent + "\n" + tasksContent + "\n" + submissionsContent + "\n" + usersContent + "\n" + achieveContent + "\n" + paymentsContent + "\n";

fs.writeFileSync('src/pages/Admin.tsx', finalCode);
console.log("Restored!");
