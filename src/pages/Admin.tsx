import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Upload, Settings, X, Shield, ListTodo, CheckCircle, Trophy, Bell, Coins, FileText, User, Trash2, Edit, Clock, Copy, Plus, Edit3, Ban } from "lucide-react";
import { db } from "../lib/firebase";
import { jsPDF } from "jspdf";
import { formatShortNumber, formatNumber } from "../lib/utils";
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

      <aside className={`absolute inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#151A23] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
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
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/5 ${item.textClass || "text-gray-300 hover:text-white"}`}
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

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    vipUsers: 0,
    totalCoins: 0,
    adsWatched: 0,
    pendingSubmissions: 0,
  });

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubUsers = onSnapshot(usersRef, (snap) => {
      let vipCount = 0;
      let coins = 0;
      let ads = 0;
      snap.docs.forEach((doc) => {
        const d = doc.data();
        if (d.role === "vip" || d.isVip === true) vipCount++;
        coins += d.vaBalance || 0;
        ads += d.dailyAdsWatched || 0;
      });
      setStats((prev) => ({
        ...prev,
        totalUsers: snap.docs.length,
        vipUsers: vipCount,
        totalCoins: coins,
        adsWatched: ads,
      }));
    });

    const subRef = collection(db, "task_submissions");
    const unsubSub = onSnapshot(query(subRef, where("status", "==", "pending")), (snap) => {
      setStats((prev) => ({ ...prev, pendingSubmissions: snap.docs.length }));
    });

    return () => {
      unsubUsers();
      unsubSub();
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: "👥" },
          { label: "VIP Users", value: stats.vipUsers, icon: "👑" },
          { label: "Total Coins", value: formatShortNumber(stats.totalCoins), icon: "💰" },
          { label: "Ads Watched", value: stats.adsWatched.toLocaleString(), icon: "📺" },
          { label: "Pending Tasks", value: stats.pendingSubmissions, icon: "⏳" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#151A23] p-6 rounded-2xl border border-white/5 flex flex-col items-center text-center">
            <span className="text-3xl mb-3">{stat.icon}</span>
            <span className="text-gray-400 text-sm font-bold mb-1">{stat.label}</span>
            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}


function AdminTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [adminTab, setAdminTab] = useState<"add" | "added">("added");
  const [newTask, setNewTask] = useState({
    title: "",
    reward: 100,
    description: "",
    category: "joined",
    youtubeUrl: "",
    telegraphUrl: "",
    targetUrl: "",
    active: true,
  });

  useEffect(() => {
    const tasksRef = collection(db, "tasks");
    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const tasksArray: any[] = [];
          snapshot.docs.forEach((docSnap) => {
            tasksArray.push({ id: docSnap.id, ...docSnap.data() });
          });
          setTasks(tasksArray);
        } else {
          setTasks([]);
        }
      },
      (error) => {
        console.error("SNAPSHOT_ERROR: Tasks admin fetch error:", error);
      },
      );
    return () => unsubscribe();
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveTask = async () => {
    if (!newTask.title) return useUIStore.getState().addToast("Title required");

    if (editingId) {
      await updateDoc(doc(db, "tasks", editingId), {
        ...newTask,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "tasks"), {
        ...newTask,
        icon: "clipboard",
      });
    }

    setAdminTab("added");
    setNewTask({
      title: "",
      reward: 100,
      description: "",
      category: "joined",
      youtubeUrl: "",
      telegraphUrl: "",
      targetUrl: "",
      active: true,
    });
  };

  const handleEdit = (task: any) => {
    setNewTask({
      title: task.title,
      reward: task.reward,
      description: task.description,
      category: task.category,
      youtubeUrl: task.youtubeUrl || "",
      telegraphUrl: task.telegraphUrl || "",
      targetUrl: task.targetUrl || "",
      active: task.active,
    });
    setEditingId(task.id);
    setAdminTab("add");
  };

  const handleDuplicate = async (task: any) => {
    const { id, ...taskWithoutId } = task;
    await addDoc(collection(db, "tasks"), {
      ...taskWithoutId,
      title: `${task.title} (Copy)`,
    });
  };

  const handleToggleActive = async (task: any) => {
    await updateDoc(doc(db, "tasks", task.id), { active: !task.active });
  };

  const handleDelete = (id: string) => {
    const { showConfirm, addToast } = useUIStore.getState();
    showConfirm({
      title: "Delete Task",
      message: "Are you sure you want to delete this task? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "tasks", id));
          addToast("Task deleted successfully", "success");
        } catch(e) {
          addToast("Failed to delete task", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Task Management</h2>
      </div>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
        <button
          onClick={() => {
            setEditingId(null);
            setNewTask({
              title: "",
              reward: 100,
              description: "",
              category: "joined",
              youtubeUrl: "",
              telegraphUrl: "",
              targetUrl: "",
              active: true,
            });
            setAdminTab("add");
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "add" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Add
        </button>
        <button
          onClick={() => setAdminTab("added")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "added" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Added
        </button>
      </div>

      {adminTab === "add" && (
        <div className="bg-[#151A23] p-6 rounded-xl border border-white/5 space-y-4 mb-6">
          <h3 className="font-bold text-white mb-2">
            {editingId ? "Edit Task" : "Create New Task"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white"
            />
            <input
              type="number"
              placeholder="Reward Coins"
              value={newTask.reward}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  reward: parseInt(e.target.value) || 0,
                })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white"
            />
            <select
              value={newTask.category}
              onChange={(e) =>
                setNewTask({ ...newTask, category: e.target.value })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white col-span-2"
            >
              <option value="joined">Joined Tasks (Telegram/Group)</option>
              <option value="visit">Visit Tasks (Website 30-40s timer)</option>
              <option value="registration">App Registration</option>
              <option value="vip">VIP User Task</option>
            </select>
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white col-span-2"
              rows={2}
            />
            <input
              placeholder="YouTube Tutorial URL"
              value={newTask.youtubeUrl}
              onChange={(e) =>
                setNewTask({ ...newTask, youtubeUrl: e.target.value })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white"
            />
            <input
              placeholder="Telegraph Details URL"
              value={newTask.telegraphUrl}
              onChange={(e) =>
                setNewTask({ ...newTask, telegraphUrl: e.target.value })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white"
            />
            <input
              placeholder="Target Action URL (e.g. Join Link / Website)"
              value={newTask.targetUrl}
              onChange={(e) =>
                setNewTask({ ...newTask, targetUrl: e.target.value })
              }
              className="bg-[#0B0E14] border border-white/10 rounded-lg px-4 py-2 text-white col-span-2"
            />
          </div>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={handleSaveTask}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold text-white"
            >
              Save Task
            </button>
            <button
              onClick={() => {
                setAdminTab("added");
                setEditingId(null);
              }}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg font-bold text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {adminTab === "added" && (
        <div className="bg-[#151A23] rounded-xl border border-white/5 overflow-hidden overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400 min-w-[800px]">
            <thead className="bg-[#1C2331] text-gray-300 uppercase text-xs">
              <tr>
                <th className="px-6 py-4">Task Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Reward</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                    <ListTodo className="w-5 h-5 text-purple-400" />
                    <div>
                      <p>{task.title}</p>
                      <p className="text-xs text-gray-500 max-w-[200px] truncate">
                        {task.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">
                    {task.category || "joined"}
                  </td>
                  <td className="px-6 py-4 text-yellow-400 font-bold">
                    +{task.reward} VA
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${task.active ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}`}
                    >
                      {task.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleToggleActive(task)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${task.active ? "bg-red-500/10 text-red-400 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 hover:bg-green-500/20"}`}
                      >
                        {task.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(task)}
                        className="p-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 rounded-lg transition-colors"
                        title="Duplicate"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tasks.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No tasks found. Create a task to offer users rewards.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const subRef = collection(db, "task_submissions");
    const unsubscribe = onSnapshot(subRef, (snapshot) => {
      if (!snapshot.empty) {
        const subsArray: any[] = [];
        snapshot.forEach((docSnap) => {
          subsArray.push({ id: docSnap.id, ...docSnap.data() });
        });
        setSubmissions(subsArray);
      } else {
        setSubmissions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string, userId: string, reward: number) => {
    try {
      await updateDoc(doc(db, "task_submissions", id), { status: newStatus });
      if (newStatus === "approved" && userId) {
        const userRef = doc(db, "users", userId.toString());
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          await updateDoc(userRef, { vaBalance: (userData.vaBalance || 0) + reward });
        }
        useUIStore.getState().addToast(`Submission approved! ${reward} VA rewarded to user.`);
      } else if (newStatus === "rejected") {
        useUIStore.getState().addToast("Submission rejected.");
      }
    } catch (e) {
      console.error(e);
      useUIStore.getState().addToast("Error updating status.");
    }
  };

  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const filteredSubs = submissions.filter(s => (s.status || "pending") === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Submissions</h2>
      </div>
      
      <div className="flex space-x-2">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${activeTab === status ? "bg-white text-[#151A23]" : "bg-white/5 text-gray-400 hover:text-white"}`}
          >
            {status}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubs.map((sub) => (
          <div key={sub.id} className="bg-[#151A23] p-4 rounded-xl border border-white/10">
             <div className="flex justify-between items-start">
               <div>
                  <p className="font-bold">{sub.taskTitle || 'Unknown Task'}</p>
                  <p className="text-sm text-gray-400">User ID: {sub.userId}</p>
               </div>
               <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${sub.status === 'approved' ? 'bg-green-500/20 text-green-500' : sub.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}`}>
                 {sub.status || 'PENDING'}
               </span>
             </div>
            <p className="font-bold">Task: {sub.taskTitle}</p>
            <p className="text-sm text-gray-400">User ID: {sub.userId}</p>
            {sub.proofUrl && (
              <img src={sub.proofUrl} alt="Proof" className="w-full h-32 object-cover mt-2 rounded" />
            )}
            {(!sub.status || sub.status === "pending") && (
              <div className="mt-4 flex space-x-2">
                <button onClick={() => handleStatusUpdate(sub.id, "approved", sub.userId, sub.reward || 0)} className="flex-1 py-2 bg-green-500/20 text-green-400 font-bold rounded-lg hover:bg-green-500 hover:text-white text-sm transition-colors">Approve</button>
                <button onClick={() => handleStatusUpdate(sub.id, "rejected", sub.userId, sub.reward || 0)} className="flex-1 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white text-sm transition-colors">Reject</button>
              </div>
            )}
          </div>
        ))}
        {filteredSubs.length === 0 && <p className="text-gray-400 py-8 text-center col-span-full">No {activeTab} submissions found.</p>}
      </div>
    </div>
  );
}

function AdminUsers() {
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
      await updateDoc(doc(db, "users", selectedUser.id), { vaBalance: increment(amount) });
      useUIStore.getState().addToast(`Balance ${balanceOperation === 'add' ? 'increased' : 'decreased'} by ${parsed}`);
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
    if (u.displayName) return u.displayName;
    const name = `${u.firstName || u.first_name || ""} ${u.lastName || u.last_name || ""}`.trim();
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
    if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
    if (num >= 10000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
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
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${selectedUser.status === 'banned' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
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
                 className={`py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all shadow-lg ${selectedUser.status === 'banned' ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-900/20' : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-900/20'}`}
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


function AdminAchievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [adminTab, setAdminTab] = useState<"add" | "added">("added");

  // Form state
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [coin, setCoin] = useState(0);
  const [target, setTarget] = useState(0);
  const [category, setCategory] = useState<"Task" | "Refer" | "Earn" | "Ads">(
    "Task",
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "achievements"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAchievements(data);
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) return useUIStore.getState().addToast("Name is required");
    if (target <= 0) return useUIStore.getState().addToast("Target must be greater than 0");
    if (coin <= 0) return useUIStore.getState().addToast("Coin reward must be greater than 0");

    const achievementData = {
      photo: photo || `https://api.dicebear.com/7.x/initials/svg?seed=${name}`,
      name,
      coin,
      target,
      category,
      status: "active",
      updatedAt: Date.now(),
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "achievements", editingId), achievementData);
        useUIStore.getState().addToast("Achievement updated!");
      } else {
        await addDoc(collection(db, "achievements"), {
          ...achievementData,
          createdAt: Date.now(),
        });
        useUIStore.getState().addToast("Achievement added!");
      }

      // Reset form
      setPhoto("");
      setName("");
      setCoin(0);
      setTarget(0);
      setCategory("Task");
      setEditingId(null);
      setAdminTab("added");
    } catch (err) {
      useUIStore.getState().addToast("Error saving achievement");
      console.error(err);
    }
  };

  const handleEdit = (ach: any) => {
    setPhoto(ach.photo || "");
    setName(ach.name);
    setCoin(ach.coin);
    setTarget(ach.target);
    setCategory(ach.category);
    setEditingId(ach.id);
    setAdminTab("add");
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    await updateDoc(doc(db, "achievements", id), {
      status: currentStatus === "active" ? "inactive" : "active",
    });
  };

  const handleDelete = (id: string) => {
    const { showConfirm, addToast } = useUIStore.getState();
    showConfirm({
      title: "Delete Achievement",
      message: "Are you sure you want to delete this achievement?",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "achievements", id));
          addToast("Achievement deleted successfully", "success");
        } catch(e) {
          addToast("Failed to delete achievement", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Trophy className="w-6 h-6 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Achievements Manager
          </h1>
          <p className="text-gray-400 text-sm">
            Manage user badges and milestones
          </p>
        </div>
      </div>

      <div className="flex space-x-4 bg-[#151A23] p-2 rounded-xl border border-white/5">
        <button
          onClick={() => {
            setAdminTab("add");
            setEditingId(null);
            setPhoto("");
            setName("");
            setCoin(0);
            setTarget(0);
            setCategory("Task");
          }}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "add" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          {editingId ? "Edit Achievement" : "Add Achievement"}
        </button>
        <button
          onClick={() => setAdminTab("added")}
          className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "added" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Added Achievements
        </button>
      </div>

      {adminTab === "add" && (
        <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-indigo-400" />
            {editingId ? "Edit Achievement Details" : "New Achievement Details"}
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                  Achievement Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Task Master"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                  Icon/Photo URL
                </label>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Leave empty for auto-generated avatar"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                  Reward (Coins)
                </label>
                <input
                  type="number"
                  value={coin}
                  onChange={(e) => setCoin(Number(e.target.value))}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Task">Task (Number of tasks completed)</option>
                  <option value="Refer">
                    Refer (Number of friends referred)
                  </option>
                  <option value="Earn">Earn (Total VA earned)</option>
                  <option value="Ads">Ads (Number of ads watched)</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">
                  Target Goal
                </label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. 50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many {category.toLowerCase()}s does the user need to reach
                  this achievement?
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full bg-indigo-600 hover:bg-indigo-700 px-6 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-indigo-600/20 transition-all mt-4"
            >
              {editingId ? "Update Achievement" : "Save Achievement"}
            </button>
          </div>
        </div>
      )}

      {adminTab === "added" && (
        <div className="bg-[#151A23] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#1C2331] text-gray-300 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4">Badge</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Target & Reward</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {achievements.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No achievements added yet
                    </td>
                  </tr>
                )}
                {achievements.map((ach) => (
                  <tr
                    key={ach.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={ach.photo}
                        alt={ach.name}
                        className="w-12 h-12 rounded-xl object-cover bg-[#0B0E14] ring-1 ring-white/10"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-base">
                        {ach.name}
                      </div>
                      <div className="text-xs text-indigo-400 mt-0.5">
                        {ach.category}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className="text-gray-300 font-medium">
                          Goal: {ach.target}
                        </span>
                        <span className="text-yellow-500 font-bold">
                          +{ach.coin} VA
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(ach.id, ach.status)}
                        className={`px-3 py-1 text-xs font-bold rounded-full border ${
                          ach.status === "active"
                            ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                        }`}
                      >
                        {ach.status === "active" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(ach)}
                          className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ach.id)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
function AdminPayments() {
  const [methods, setMethods] = useState<any>({ deposit: [], withdraw: [] });
  const [activeType, setActiveType] = useState<"deposit" | "withdraw" | "requests" | "tasks" | "achievements" | "submissions">("deposit");
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
      useUIStore.getState().addToast("Method saved!");
    } catch (e) {
      console.error(e);
      useUIStore.getState().addToast("Failed to save");
    }
  };
  
  const handleDelete = async (id: string, type: string) => {
    
    try {
      const newMethods = { ...methods };
      newMethods[type] = newMethods[type].filter((m: any) => m.id && m.id.toString() !== id.toString());
      await setDoc(doc(db, "settings", "payment_methods"), newMethods);
      setMethods(newMethods);
    } catch (e) {
      console.error(e);
      useUIStore.getState().addToast("Failed to delete");
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
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Deposit Methods
        </button>
        <button
          onClick={() => { setActiveType("withdraw"); setIsEditing(null); setSubTab("old"); }}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Withdraw Methods
        </button>
        <button
          onClick={() => { setActiveType("requests"); setIsEditing(null); }}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "requests" ? "bg-red-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Requests
        </button>
        <button
          onClick={() => { setActiveType("tasks"); setIsEditing(null); }}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "tasks" ? "bg-emerald-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
        >
          Task Management
        </button>
        <button
          onClick={() => { setActiveType("achievements"); setIsEditing(null); }}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "achievements" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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
               className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${subTab === "add" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
             >
               {activeType === "deposit" ? "Add Deposit Methods" : "Add Withdraw Methods"}
             </button>
             <button
               onClick={() => setSubTab("old")}
               className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${subTab === "old" ? "bg-indigo-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
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
                <h3 className="font-bold text-white text-lg mb-6">{isEditing ? "Edit Method" : `Add New ${activeType === "withdraw" ? "Withdraw" : "Deposit"} Method`}</h3>
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


function AdminSettings() {
  const [editing, setEditing] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  
  // Data States
  const [botSettingData, setBotSettingData] = useState<any>({ botUsername: "", botToken: "", botHostingLink: "", miniAppUrl: "", paymentChannelId: "", othersChannelId: "", imgbbApi: "" });
  const [developerData, setDeveloperData] = useState<any>({ name: "", role: "", whatsapp: "", telegram: "", image: "", description: "" });
  const [supportAgents, setSupportAgents] = useState<any[]>([]);
  
  const [adsRewardsData, setAdsRewardsData] = useState<any>({});
  
  const [adminTab, setAdminTab] = useState<"added" | "add">("added");
  const [editSupportId, setEditSupportId] = useState<string | null>(null);

  useEffect(() => {
    let unsubs: any[] = [];
    import("firebase/firestore").then(m => {
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "bot_setting"), (snap) => {
            if (snap.exists()) setBotSettingData(snap.data());
        }));
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "developer_profile"), (snap) => {
            if (snap.exists()) setDeveloperData(snap.data());
        }));
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "support"), (snap) => {
            if (snap.exists() && snap.data().agents) setSupportAgents(snap.data().agents);
        }));
        
        unsubs.push(m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (snap) => {
            if (snap.exists()) setAdsRewardsData(snap.data() || {});
        }));
    });
    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const handleEdit = async (key: string) => {
    setEditing(key);
    if (!["bot_setting", "developer_profile", "support", "vip_plan", "feature_toggles", "ads_rewards_config", "coin_values"].includes(key)) {
      const snap = await getDoc(doc(db, "settings", key));
      setEditContent(snap.exists() ? snap.data().content || "" : "");
    }
  };

  const handleSave = async (stayOpen: boolean = false) => {
    if (editing) {
      try {
        if (editing === "bot_setting") {
          await setDoc(doc(db, "settings", "bot_setting"), botSettingData);
        } else if (editing === "developer_profile") {
          await setDoc(doc(db, "settings", "developer_profile"), developerData, { merge: true });
        } else if (editing === "support") {
          await setDoc(doc(db, "settings", "support"), { agents: supportAgents.filter((a: any) => a.name && a.name.trim() !== "") }, { merge: true });
        
        } else if (!["feature_toggles", "ads_rewards_config", "coin_values"].includes(editing)) {
          await setDoc(doc(db, "settings", editing), { content: editContent }, { merge: true });
        }
        
        useUIStore.getState().addToast("Saved successfully!");
        if (!stayOpen) setEditing(null);
      } catch (err) {
        useUIStore.getState().addToast("Failed to save", "error");
      }
    }
  };

  if (editing) {
    if (editing === "feature_toggles") {
      return <FeatureTogglesEditor onClose={() => setEditing(null)} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "feature_toggles"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Toggles");
        setEditing(null);
      }} />;
    }
    if (editing === "ads_rewards_config") {
      return <AdsRewardsEditor onClose={() => setEditing(null)} initialValues={adsRewardsData} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "ads_rewards_config"), vals, { merge: true });
        setAdsRewardsData(vals);
        useUIStore.getState().addToast("Saved Config");
        setEditing(null);
      }} />;
    }
    if (editing === "developer_profile") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Developer Profile</h2>
          </div>
          <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Name</label><input type="text" value={developerData.name || ""} onChange={(e) => setDeveloperData({...developerData, name: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Role Title</label><input type="text" value={developerData.role || ""} onChange={(e) => setDeveloperData({...developerData, role: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Photo URL</label><input type="text" value={developerData.image || ""} onChange={(e) => setDeveloperData({...developerData, image: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://..." /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Bio / Description</label><textarea value={developerData.description || ""} onChange={(e) => setDeveloperData({...developerData, description: e.target.value})} className="w-full h-24 bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">WhatsApp URL</label><input type="text" value={developerData.whatsapp || ""} onChange={(e) => setDeveloperData({...developerData, whatsapp: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://wa.me/..." /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Telegram URL</label><input type="text" value={developerData.telegram || ""} onChange={(e) => setDeveloperData({...developerData, telegram: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://t.me/..." /></div>
          </div>
          <button onClick={() => handleSave(false)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors">Save Developer Profile</button>
        </div>
      );
    }

    if (editing === "bot_setting") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Bot Settings</h2>
          </div>
          <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 space-y-4">
             <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Imgbb API Key (For Task Proofs)</label>
              <input type="text" value={botSettingData.imgbbApi || ""} onChange={(e) => setBotSettingData({...botSettingData, imgbbApi: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white mb-4" placeholder="e.g. 1234567890abcdef..." />
              <label className="block text-xs font-bold text-gray-400 mb-1">Bot Username</label>
              <input type="text" value={botSettingData.botUsername || ""} onChange={(e) => setBotSettingData({...botSettingData, botUsername: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
             </div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Bot Token</label><input type="password" value={botSettingData.botToken || ""} onChange={(e) => setBotSettingData({...botSettingData, botToken: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
             <div><label className="block text-xs font-bold text-gray-400 mb-1">Payment Channel ID</label><input type="text" value={botSettingData.paymentChannelId || ""} onChange={(e) => setBotSettingData({...botSettingData, paymentChannelId: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" /></div>
          </div>
          <button onClick={() => handleSave(false)} className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl">Save Settings</button>
        </div>
      );
    }

    if (editing === "vip_plan") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
          </div>
          <AdminVIP />
        </div>
      );
    }

    if (editing === "support") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-3 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Support Management</h2>
          </div>
          <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
            <button onClick={() => setAdminTab("added")} className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "added" ? "bg-blue-600 text-white" : "text-gray-400"}`}>Support Lists</button>
            <button onClick={() => { setAdminTab("add"); setEditSupportId(null); setSupportAgents([...supportAgents, { id: Date.now().toString(), name: "", role: "", link: "", image: "" }]); setEditSupportId(Date.now().toString()); }} className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "add" ? "bg-blue-600 text-white" : "text-gray-400"}`}>Add New</button>
          </div>
          {adminTab === "added" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportAgents.filter(a => a.name.trim() !== "").map(agent => (
                <div key={agent.id} className="bg-[#151A23] border border-white/10 rounded-xl p-4 flex justify-between items-center">
                  <div><p className="font-bold text-white">{agent.name}</p><p className="text-xs text-gray-400">{agent.role}</p></div>
                  <div className="flex space-x-2">
                    <button onClick={() => { setEditSupportId(agent.id); setAdminTab("add"); }} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => { setSupportAgents(supportAgents.filter(a => a.id !== agent.id)); setTimeout(() => handleSave(true), 100); }} className="p-2 bg-red-500/20 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {adminTab === "add" && (
            <div className="space-y-6">
              {supportAgents.filter(a => a.id === editSupportId).map(agent => (
                <div key={agent.id} className="bg-[#151A23] border border-white/10 rounded-xl p-6">
                  <div className="space-y-4">
                    <div><label className="text-xs text-gray-400">Name</label><input type="text" value={agent.name} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, name: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Role</label><input type="text" value={agent.role} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, role: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Link (e.g. https://t.me/user)</label><input type="text" value={agent.link} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, link: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Photo Link (URL)</label><input type="text" value={agent.image || ''} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, image: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://example.com/photo.png" /></div>
                  </div>
                  <div className="flex space-x-4 mt-6">
                    <button onClick={() => { handleSave(true); setAdminTab("added"); }} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-xl">Save Agent</button>
                    <button onClick={() => { setSupportAgents(supportAgents.filter(a => a.name.trim() !== "")); setAdminTab("added"); }} className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-xl">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Edit Content</h2>
          </div>
          <button onClick={() => handleSave()} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium">Save Content</button>
        </div>
        <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full h-96 bg-[#151A23] border border-white/10 rounded-xl p-4 text-white" placeholder="Write content here..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">Admin Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Ad & Rewards", desc: "Manage limits & rewards", key: "ads_rewards_config", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Feature Toggles", desc: "Enable/disable features", key: "feature_toggles", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Bot Settings", desc: "Tokens & Configs", key: "bot_setting", icon: <Settings className="w-5 h-5 text-blue-400" /> },
          { title: "Developer Profile", desc: "App Owner Info", key: "developer_profile", icon: <User className="w-5 h-5 text-purple-400" /> },
          { title: "Support Management", desc: "Admin Contacts", key: "support", icon: <Settings className="w-5 h-5 text-green-400" /> },
          { title: "VIP Plans", desc: "Manage Subscriptions", key: "vip_plan", icon: <Settings className="w-5 h-5 text-purple-400" /> },
          
          
          
        ].map((section) => (
          <div key={section.key} className="bg-[#151A23] p-5 rounded-2xl border border-white/5 shadow-lg group hover:border-blue-500/30 transition-all">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-[#0B0E14] rounded-xl">{section.icon}</div>
              <div><h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{section.title}</h3><p className="text-xs text-gray-500">{section.desc}</p></div>
            </div>
            <button onClick={() => handleEdit(section.key)} className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl transition-colors text-sm font-bold border border-blue-600/20">Edit Content</button>
          </div>
        ))}
      </div>
    </div>
  );
}


function AdminVIP() {
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
          className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === "added" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
        >
          Added
        </button>
        <button
          onClick={() => { setActiveTab("add"); setEditingPlan({ title: "", photo: "", duration: 30, coin: 0, currency: "৳", buttonText: "Upgrade Now", sortOrder: 0, status: "active", features: [] }); }}
          className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === "add" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
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
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-400">Plan Title</label><input type="text" value={editingPlan.title || ''} onChange={e => setEditingPlan({...editingPlan, title: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
               <div><label className="text-xs text-gray-400">Photo URL</label><input type="text" value={editingPlan.photo || ''} onChange={e => setEditingPlan({...editingPlan, photo: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-400">Price (Coin/Amount)</label><input type="number" value={editingPlan.coin || 0} onChange={e => setEditingPlan({...editingPlan, coin: parseFloat(e.target.value) || 0})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
               <div><label className="text-xs text-gray-400">Currency Symbol</label><input type="text" value={editingPlan.currency || '৳'} onChange={e => setEditingPlan({...editingPlan, currency: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-400">Duration (Days)</label><input type="number" value={editingPlan.duration || 0} onChange={e => setEditingPlan({...editingPlan, duration: parseInt(e.target.value) || 0})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
               <div><label className="text-xs text-gray-400">Sort Order</label><input type="number" value={editingPlan.sortOrder || 0} onChange={e => setEditingPlan({...editingPlan, sortOrder: parseInt(e.target.value) || 0})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-xs text-gray-400">Button Text</label><input type="text" value={editingPlan.buttonText || 'Upgrade Now'} onChange={e => setEditingPlan({...editingPlan, buttonText: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
               <div>
                  <label className="text-xs text-gray-400">Status</label>
                  <select value={editingPlan.status || 'active'} onChange={e => setEditingPlan({...editingPlan, status: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
               </div>
             </div>
             <div>
                <label className="text-xs text-gray-400">Features (comma separated texts)</label>
                <textarea 
                  value={(editingPlan.features || []).map((f: any) => f.text || f).join(", ")} 
                  onChange={e => {
                    const texts = e.target.value.split(",").map((s: string) => s.trim()).filter((s: string) => s);
                    const features = texts.map((t: string) => ({ id: Math.random().toString(36).substr(2, 9), text: t }));
                    setEditingPlan({...editingPlan, features});
                  }} 
                  className="w-full h-24 bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" 
                />
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
            <div key={p.id} className="bg-[#151A23] border border-white/5 rounded-xl p-6 relative overflow-hidden">
               {p.photo && <img src={p.photo} alt={p.title} className="absolute right-0 top-0 w-24 h-24 object-cover opacity-20" />}
               <h3 className="text-xl font-bold text-white mb-2">{p.title}</h3>
               <p className="text-yellow-400 font-bold mb-4">{p.currency || '৳'}{p.coin} / {p.duration} days</p>
               <ul className="space-y-2 mb-6 text-sm text-gray-400">
                 {p.features?.map((f: any, i: number) => <li key={i}>• {f.text || f}</li>)}
               </ul>
               <div className="flex space-x-2 relative z-10">
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

function AdminRequests() {
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
      let rejectReason = "";
      if (newStatus === "rejected") {
        rejectReason = window.prompt("Please enter the reason for rejection:") || "";
        if (!rejectReason) {
          useUIStore.getState().addToast("Rejection reason is required.", "error");
          return;
        }
      }

      const updateData: any = { status: newStatus };
      if (newStatus === "rejected") {
        updateData.rejectReason = rejectReason;
      }

      await updateDoc(doc(db, "transactions", req.id), updateData);
      
      if (req.type === "deposit" && newStatus === "completed" && req.userId) {
        await updateDoc(doc(db, "users", req.userId), {
          vaBalance: increment(Number(req.amount || 0))
        });
      } else if (req.type === "withdraw" && newStatus === "rejected" && req.userId) {
        // Refund the withdrawn amount
        await updateDoc(doc(db, "users", req.userId), {
          vaBalance: increment(Number(req.amount || 0))
        });
      }
      useUIStore.getState().addToast(`Request ${newStatus}`, "success");
    } catch (error) {
      useUIStore.getState().addToast("Update failed", "error");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl">
        <button onClick={() => setActiveType("deposit")} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>Deposits</button>
        <button onClick={() => setActiveType("withdraw")} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>Withdrawals</button>
        <button onClick={() => setActiveType("submissions")} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${activeType === "submissions" ? "bg-green-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>Task Submissions</button>
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
                className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors ${activeStatus === status ? "bg-white text-[#151A23]" : "bg-white/5 text-gray-400 hover:text-white"}`}
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
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{req.method || 'Unknown Method'}</h4>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{req.username || req.userId}</span>
                      </div>
                      
                      <div className="mt-2 space-y-1 text-xs text-gray-400">
                        {req.fiatAmount && <p><span className="font-bold text-gray-500">Fiat Amount:</span> {req.fiatAmount}</p>}
                        {(req.accountDetails || req.address) && <p><span className="font-bold text-gray-500">Address/Details:</span> {req.accountDetails || req.address}</p>}
                        {req.sender && <p><span className="font-bold text-gray-500">Sender/Account:</span> {req.sender}</p>}
                        {req.txId && <p><span className="font-bold text-gray-500">TrxID:</span> {req.txId}</p>}
                        {req.memo && <p><span className="font-bold text-gray-500">Memo/Notes:</span> {req.memo}</p>}
                      </div>
                      
                      <p className="text-[10px] text-gray-500 mt-2">{new Date(req.timestamp || Date.now()).toLocaleString()}</p>
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
                        <span className={`text-xs font-bold px-2 py-1 rounded ${req.status === 'completed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
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

function CoinValuesEditor({ onClose, onSave }: any) {
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
        <button onClick={() => setActiveTab('bdt')} className={`px-4 py-2 text-sm font-bold rounded ${activeTab === 'bdt' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>BDT Values (৳)</button>
        <button onClick={() => setActiveTab('crypto')} className={`px-4 py-2 text-sm font-bold rounded ${activeTab === 'crypto' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>Crypto Values ($)</button>
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
function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>({ 
    normal: initialValues?.normal || {}, 
    vip: initialValues?.vip || {}, 
    settings: initialValues?.settings || {},
    coinValues: {}
  });

  useEffect(() => {
    import("firebase/firestore").then(m => {
        m.getDoc(m.doc(db, "settings", "coin_values")).then(snap => {
            if (snap.exists()) {
                setValues(prev => ({ ...prev, coinValues: snap.data() }));
            }
        });
    });
  }, []);

  const handleLocalSave = async () => {
    try {
        const { getDoc, doc, setDoc } = require("firebase/firestore");
        // Save Ads config
        await setDoc(doc(db, "settings", "ads_rewards_config"), { normal: values.normal, vip: values.vip, settings: values.settings }, { merge: true });
        // Save Coin values
        await setDoc(doc(db, "settings", "coin_values"), values.coinValues, { merge: true });
        
        onClose();
        useUIStore.getState().addToast("Saved Settings successfully");
    } catch (e) {
        useUIStore.getState().addToast("Error saving", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">Edit Ads & Rewards Settings</h2>
        <button onClick={onClose}><X/></button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Normal Ads Daily Limit</label>
            <input type="number" value={values.normal?.adsLimit ?? 10} onChange={e => setValues({...values, normal: {...values.normal, adsLimit: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Normal Ads Reward</label>
            <input type="number" value={values.normal?.reward ?? 1} onChange={e => setValues({...values, normal: {...values.normal, reward: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-yellow-400">VIP Ads Daily Limit</label>
            <input type="number" value={values.vip?.adsLimit ?? 20} onChange={e => setValues({...values, vip: {...values.vip, adsLimit: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-yellow-400">VIP Ads Reward</label>
            <input type="number" value={values.vip?.reward ?? 2} onChange={e => setValues({...values, vip: {...values.vip, reward: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>

        <hr className="border-white/10 my-4" />
        <h3 className="font-bold text-lg">General Settings</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-green-400">BDT Values (৳)</label>
            <input type="number" step="any" value={values.coinValues?.bdtRate || values.coinValues?.bKash || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, bdtRate: parseFloat(e.target.value) || 0, bKash: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Crypto Values ($)</label>
            <input type="number" step="any" value={values.coinValues?.cryptoRate || 1} onChange={e => setValues({...values, coinValues: {...values.coinValues, cryptoRate: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-blue-400">Ads Timer (Seconds)</label>
            <input type="number" value={values.settings?.adsSecond ?? 10} onChange={e => setValues({...values, settings: {...values.settings, adsSecond: parseInt(e.target.value) || 0}})} placeholder="e.g. 10" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-green-400">Daily Bonus Amount</label>
            <input type="number" value={values.settings?.dailyBonus ?? 100} onChange={e => setValues({...values, settings: {...values.settings, dailyBonus: parseFloat(e.target.value) || 0}})} placeholder="e.g. 100" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm mb-1 text-purple-400">VA Token Mining (Per 24h)</label>
            <input type="number" value={values.settings?.miningRate ?? 50} onChange={e => setValues({...values, settings: {...values.settings, miningRate: parseFloat(e.target.value) || 0}})} placeholder="e.g. 50" className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <hr className="border-white/10 my-4" />
        <h3 className="font-bold text-lg">Financial Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw</label>
            <input type="number" value={values.settings?.minWithdraw ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdraw: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Max Withdraw</label>
            <input type="number" value={values.settings?.maxWithdraw ?? 0} onChange={e => setValues({...values, settings: {...values.settings, maxWithdraw: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Deposit</label>
            <input type="number" value={values.settings?.minDeposit ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minDeposit: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">Max Deposit</label>
            <input type="number" value={values.settings?.maxDeposit ?? 0} onChange={e => setValues({...values, settings: {...values.settings, maxDeposit: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Min Withdraw Referrals</label>
            <input type="number" value={values.settings?.minWithdrawRefer ?? 0} onChange={e => setValues({...values, settings: {...values.settings, minWithdrawRefer: parseInt(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
        
        <hr className="border-white/10 my-4" />
        <h3 className="font-bold text-lg">Referral Bonus Settings</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-400">Referrer Bonus</label>
            <input type="number" value={values.settings?.userReferBonus ?? 250} onChange={e => setValues({...values, settings: {...values.settings, userReferBonus: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-gray-400">New User Bonus</label>
            <input type="number" value={values.settings?.newUserReferBonus ?? 100} onChange={e => setValues({...values, settings: {...values.settings, newUserReferBonus: parseFloat(e.target.value) || 0}})} className="w-full bg-[#151A23] border border-white/10 p-3 rounded-xl text-white" />
          </div>
        </div>
      </div>

      <button onClick={handleLocalSave} className="w-full bg-blue-600 hover:bg-blue-700 font-bold py-3 rounded-xl text-white">Save Changes</button>
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
