const fs = require('fs');
let extracted = JSON.parse(fs.readFileSync('extracted_safe.json', 'utf8'));

let dashContent = extracted[0];
let submissionsContent = extracted[1];
let adminSettingsContent = extracted[2];
let adminVipContent = extracted[3];

let tasksContent = fs.readFileSync('tasks.txt', 'utf8').replace('==AdminTasks==', '');
let achieveContent = fs.readFileSync('achieve.txt', 'utf8').replace('==AdminAchievements==', '');
let paymentsContent = fs.readFileSync('payments.txt', 'utf8');
let reqsContent = fs.readFileSync('reqs_backup.txt', 'utf8');

const importsAndLayout = `import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Upload, Settings, X, Shield, ListTodo, CheckCircle, Trophy, Bell, Coins, FileText, User, Trash2, Edit, Clock } from "lucide-react";
import { db } from "../lib/firebase";
import { jsPDF } from "jspdf";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  limit,
  increment,
} from "firebase/firestore";
import { useUIStore } from "../store/useUIStore";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto w-full relative bg-[#0B0E14] text-white">
      {sidebarOpen && (
        <div className="absolute inset-0 bg-black/50 z-40 " onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={\`absolute inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#151A23] flex flex-col transform transition-transform duration-300 \${sidebarOpen ? "translate-x-0" : "-translate-x-full"}\`}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-crypto-primary">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">Admin CMS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
            { name: "Users page", icon: Users, path: "/admin/users" },
            { name: "Payments", icon: Upload, path: "/admin/payments" },
            { name: "Settings", icon: Settings, path: "/admin/settings" },
            { name: "Exit Admin", icon: X, path: "/", textClass: "text-red-400" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={\`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 \${item.textClass || "text-gray-300 hover:text-white"}\`}
            >
              <item.icon className="w-5 h-5 opacity-70" />
              <span className="font-bold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-[#151A23] flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <div className="space-y-1.5">
                <span className="block w-5 h-0.5 bg-current rounded-full"></span>
                <span className="block w-4 h-0.5 bg-current rounded-full"></span>
                <span className="block w-5 h-0.5 bg-current rounded-full"></span>
              </div>
            </button>
            <h1 className="font-bold text-lg">Admin Panel</h1>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-[#0B0E14] hide-scrollbar">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
`;

const usersContent = `
function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

const editorsContent = `
function CoinValuesEditor({ onClose, onSave, initialValues }: any) {
  const [activeTab, setActiveTab] = useState("deposit");
  const [values, setValues] = useState<any>(initialValues || {});
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Edit Coin Values</h2>
        <button onClick={onClose}><X/></button>
      </div>
      <div>
        <label className="block text-sm mb-1">1 VA to TK (bKash/Nagad)</label>
        <input type="number" step="any" value={values.bKash || 1} onChange={e => setValues({...values, bKash: parseFloat(e.target.value)})} className="w-full bg-[#151A23] border border-white/10 p-2 rounded" />
      </div>
      <button onClick={() => onSave(values)} className="w-full py-2 bg-blue-600 rounded">Save</button>
    </div>
  );
}

function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>(initialValues || { normal: {}, vip: {} });
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Edit Ads/Rewards</h2>
        <button onClick={onClose}><X/></button>
      </div>
      <div>
        <label className="block text-sm mb-1">Normal Ads Limit</label>
        <input type="number" value={values.normal?.adsLimit || 10} onChange={e => setValues({...values, normal: {...values.normal, adsLimit: parseInt(e.target.value)}})} className="w-full bg-[#151A23] border border-white/10 p-2 rounded" />
      </div>
      <button onClick={() => onSave(values)} className="w-full py-2 bg-blue-600 rounded">Save</button>
    </div>
  );
}

function FeatureTogglesEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>(initialValues || { maintenance: false });
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Feature Toggles</h2>
        <button onClick={onClose}><X/></button>
      </div>
      <div className="flex justify-between">
        <span>Maintenance Mode</span>
        <input type="checkbox" checked={values.maintenance} onChange={e => setValues({...values, maintenance: e.target.checked})} />
      </div>
      <button onClick={() => onSave(values)} className="w-full py-2 bg-blue-600 rounded">Save</button>
    </div>
  );
}

function AdminDeveloper() {
   return <div>Developer Profile Manager</div>;
}
`;

let finalFile = importsAndLayout + "\n" + dashContent + "\n" + tasksContent + "\n" + submissionsContent + "\n" + usersContent + "\n" + achieveContent + "\n" + paymentsContent + "\n" + adminSettingsContent + "\n" + adminVipContent + "\n" + reqsContent + "\n" + editorsContent;

fs.writeFileSync('src/pages/Admin.tsx', finalFile);
