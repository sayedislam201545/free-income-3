import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import {
  Settings,
  Users,
  LayoutDashboard,
  Bell,
  FileText,
  Gift,
  Download,
  Upload,
  Shield,
  Menu,
  X,
  Video,
  ListTodo,
  Plus,
  ExternalLink,
  CheckCircle,
  Edit,
  Trash2,
  Copy,
  Trophy,
} from "lucide-react";
import { db } from "../lib/firebase";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { useEffect } from "react";
import PremiumBackButton from "../components/PremiumBackButton";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const generateAdminPDF = async () => {
    try {
      const docPdf = new jsPDF();
      docPdf.setFontSize(22);
      docPdf.text("Admin System Activity Summary", 20, 20);

      docPdf.setFontSize(14);
      docPdf.text("Generated on: " + new Date().toLocaleString(), 20, 30);

      docPdf.setFontSize(12);
      let yPos = 50;

      // Fetch summary stats
      const usersSnap = await getDocs(collection(db, "users"));
      const tasksSnap = await getDocs(collection(db, "tasks"));
      const txSnap = await getDocs(collection(db, "transactions"));

      docPdf.text(`Total Users: ${usersSnap.size}`, 20, yPos);
      yPos += 10;
      docPdf.text(`Total Tasks: ${tasksSnap.size}`, 20, yPos);
      yPos += 10;
      docPdf.text(`Total Transactions: ${txSnap.size}`, 20, yPos);
      yPos += 20;

      docPdf.text("Recent Transactions (Last 5):", 20, yPos);
      yPos += 10;
      
      const recentTx = txSnap.docs
        .map(d => d.data())
        .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);

      recentTx.forEach((tx: any, index) => {
         docPdf.text(`${index + 1}. [${tx.type || 'Unknown'}] Amount: ${tx.amount || 0} Status: ${tx.status || 'N/A'}`, 20, yPos);
         yPos += 10;
      });

      docPdf.save(`Admin_Activity_Summary_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto w-full relative bg-[#0B0E14] text-white">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black/50 z-40 "
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`absolute inset-y-0 left-0 z-50 w-64 border-r border-white/10 bg-[#151A23] flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-crypto-primary">
            <Shield className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">Admin CMS</span>
          </div>
          <button
            className=" text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
            
            
            
            { name: "Users & VIP", icon: Users, path: "/admin/users" },
            { name: "Resources", icon: Upload, path: "/admin/payments" },
            { name: "Settings", icon: Settings, path: "/admin/settings" },
            { name: "Activity Summary (PDF)", icon: FileText, path: "#", onClick: generateAdminPDF },
            { name: "Exit Admin", icon: X, path: "/", textClass: "text-red-400" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={(e) => {
                if (item.onClick) {
                   e.preventDefault();
                   item.onClick();
                }
                setSidebarOpen(false);
              }}
              className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
            >
              <item.icon className={`w-5 h-5 ${item.textClass || ""}`} />
              <span className={`text-sm font-medium ${item.textClass || ""}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 border-b border-white/10 bg-[#151A23] flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center space-x-3">
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-semibold text-lg truncate ml-2">Admin Panel</h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white relative p-1">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-[#151A23]"></span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 bg-[#0B0E14]">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="tasks" element={<AdminTasks />} />
            <Route path="submissions" element={<AdminSubmissions />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route
              path="*"
              element={
                <div className="text-gray-400">
                  Section pending implementation...
                </div>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    vipUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingTickets: 0,
    activeTasks: 0,
    totalCoins: 0,
    adsWatched: 0,
    pendingSubmissions: 0,
  });

  const [toggles, setToggles] = useState({
    maintenance: false,
    registration: true,
    withdrawals: true,
    dailyCheckin: true,
  });

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubUsers = onSnapshot(usersRef, (snap) => {
      if (!snap.empty) {
        let vipCount = 0;
        let coins = 0;
        let ads = 0;
        snap.docs.forEach((doc) => {
          const d = doc.data();
          if (d.role === "vip") vipCount++;
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
      } else {
        setStats((prev) => ({
          ...prev,
          totalUsers: 0,
          vipUsers: 0,
          totalCoins: 0,
          adsWatched: 0,
        }));
      }
    });

    const txRef = collection(db, "transactions");
    const unsubTx = onSnapshot(txRef, (snap) => {
      if (!snap.empty) {
        let deposits = 0;
        let withdrawals = 0;
        let pendingReqs = 0;
        snap.docs.forEach((docSnap) => {
          const val = docSnap.data();
          if (val.type === "deposit" && val.status === "completed")
            deposits += val.amount || 0;
          if (val.type === "withdraw" && val.status === "completed")
            withdrawals += val.amount || 0;
          if (
            (val.type === "deposit" || val.type === "withdraw") &&
            val.status === "pending"
          )
            pendingReqs++;
        });
        setStats((prev) => ({
          ...prev,
          totalDeposits: deposits,
          totalWithdrawals: withdrawals,
          pendingTickets: pendingReqs,
        }));
      } else {
        setStats((prev) => ({
          ...prev,
          totalDeposits: 0,
          totalWithdrawals: 0,
          pendingTickets: 0,
        }));
      }
    });

    const tasksRef = collection(db, "tasks");
    const unsubTasks = onSnapshot(tasksRef, (snap) => {
      setStats((prev) => ({
        ...prev,
        activeTasks: snap.docs.filter((d) => d.data().active).length,
      }));
    });

    const subsRef = collection(db, "task_submissions");
    const unsubSubs = onSnapshot(subsRef, (snap) => {
      setStats((prev) => ({
        ...prev,
        pendingSubmissions: snap.docs.filter(
          (d) => d.data().status === "pending",
        ).length,
      }));
    });

    const togglesRef = doc(db, "settings", "toggles");
    const unsubToggles = onSnapshot(togglesRef, (snap) => {
      if (snap.exists()) {
        setToggles((prev) => ({ ...prev, ...snap.data() }));
      }
    });

    return () => {
      unsubUsers();
      unsubTx();
      unsubToggles();
      unsubTasks();
      unsubSubs();
    };
  }, []);

  const handleToggle = async (key: string, value: boolean) => {
    await updateDoc(doc(db, "settings", "toggles"), { [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Total Users",
            value: stats.totalUsers.toLocaleString(),
            color: "text-blue-400",
          },
          {
            label: "VIP Users",
            value: stats.vipUsers.toLocaleString(),
            color: "text-purple-400",
          },
          {
            label: "Total Balance (VA)",
            value: stats.totalCoins.toLocaleString(),
            color: "text-yellow-400",
          },
          {
            label: "Total Deposits",
            value: `${stats.totalDeposits.toLocaleString()} VA`,
            color: "text-green-400",
          },
          {
            label: "Total Withdrawals",
            value: `${stats.totalWithdrawals.toLocaleString()} VA`,
            color: "text-red-400",
          },
          {
            label: "Pending Requests",
            value: stats.pendingTickets.toString(),
            color: "text-orange-400",
          },
          {
            label: "Active Tasks",
            value: stats.activeTasks.toString(),
            color: "text-cyan-400",
          },
          {
            label: "Pending Submissions",
            value: stats.pendingSubmissions.toString(),
            color: "text-pink-400",
          },
          {
            label: "Ads Watched Today",
            value: stats.adsWatched.toString(),
            color: "text-emerald-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[#151A23] p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-white/10 transition-colors" />
            <p className="text-gray-400 text-sm mb-2 font-medium">
              {stat.label}
            </p>
            <h3 className={`text-3xl font-black ${stat.color} tracking-tight`}>
              {stat.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#151A23] p-6 rounded-xl border border-white/5">
          <h3 className="font-semibold mb-4">Feature Toggles</h3>
          <div className="space-y-4">
            {[
              { label: "Maintenance Mode", key: "maintenance" },
              { label: "Registration", key: "registration" },
              { label: "Withdrawals", key: "withdrawals" },
              { label: "Daily Check-in", key: "dailyCheckin" },
            ].map((feature) => {
              const isActive = toggles[feature.key as keyof typeof toggles];
              return (
                <div
                  key={feature.key}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-gray-300">{feature.label}</span>
                  <div
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${isActive ? "bg-crypto-primary" : "bg-gray-600"}`}
                    onClick={() => handleToggle(feature.key, !isActive)}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${isActive ? "right-0.5" : "left-0.5"}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
        console.warn("Tasks admin fetch error:", error);
      },
    );
    return () => unsubscribe();
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSaveTask = async () => {
    if (!newTask.title) return alert("Title required");

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

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
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
function AdminSettings() {
  const [editing, setEditing] = useState<string | null>(null);
  const [adminTab, setAdminTab] = useState<"add" | "added">("added");
  const [editSupportId, setEditSupportId] = useState<number | null>(null);
  const [editVipId, setEditVipId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [coinValues, setCoinValues] = useState<any>({
    bkash: 1,
    nagad: 1,
    rocket: 1,
    usdt: 0.01,
    usdc: 0.01,
    ton: 0.005,
    trx: 0.1,
    not: 10,
    bnb: 0.0001,
  });
  const [botSettingData, setBotSettingData] = useState<any>({ botUsername: "", botToken: "", botHostingLink: "", miniAppUrl: "" });
  const [developerData, setDeveloperData] = useState<any>({
    name: "Md Sayed Islam",
    role: "Lead Developer & Architect",
    image:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4",
    description:
      "Passionate full-stack developer specializing in premium mobile-first web applications.",
    telegram: "https://t.me/sayedislam201545",
    whatsapp: "https://wa.me/8801700000000",
  });
  const [supportAgents, setSupportAgents] = useState<any[]>([]);
  const [adsConfig, setAdsConfig] = useState<any>({
    adsEnabled: true,
    dailyAdsLimit: 50,
    adWatchDuration: 15,
    rewardPerAd: 50,
    monetagZoneId: "",
    monetagSdk: ""
  });
  const [rewardsConfig, setRewardsConfig] = useState<any>({
    dailyBonusReward: 100,
    vipBonusMultiplier: 1.5,
  });
  const [adsTab, setAdsTab] = useState<"general" | "config">("general");
  const [vipPlans, setVipPlans] = useState<any[]>([]);

  const handleEdit = async (key: string) => {
    setEditing(key);
    setAdminTab("added");
    setEditSupportId(null);
    setEditVipId(null);
    const docRef = doc(db, "settings", key === "vip_plan" ? "vip_plans" : key);
    try {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        if (key === "ads_rewards_config") {
          const adsSnap = await getDoc(doc(db, "settings", "ads_config"));
          if (adsSnap.exists()) setAdsConfig({ ...adsConfig, ...adsSnap.data() });
          const rewSnap = await getDoc(doc(db, "settings", "rewards_config"));
          if (rewSnap.exists()) setRewardsConfig({ ...rewardsConfig, ...rewSnap.data() });
        } else if (key === "coin_values") {
          setCoinValues({ ...coinValues, ...data });
        } else if (key === "bot_setting") {
          setBotSettingData(data || { botUsername: "", botToken: "", botHostingLink: "", miniAppUrl: "" });
        } else if (key === "developer_profile") {
          if (data.name) setDeveloperData(data);
        } else if (key === "support") {
          if (data.agents) setSupportAgents(data.agents);
        } else if (key === "vip_plan") {
          if (data.plans) setVipPlans(data.plans);
        } else if (data.content) {
          setEditContent(data.content);
        } else {
          setEditContent("");
        }
      } else {
        setEditContent("");
        if (key === "support") setSupportAgents([]);
        if (key === "vip_plan") setVipPlans([]);
      }
    } catch (e) {
      console.warn("Fetch permissions error", e);
      setEditContent("");
    }
  };

  const handleSave = async (stayOpen: boolean = false) => {
    if (editing) {
      try {
        if (editing === "ads_rewards_config") {
          await setDoc(doc(db, "settings", "ads_config"), adsConfig, { merge: true });
          await setDoc(doc(db, "settings", "rewards_config"), rewardsConfig, { merge: true });
        } else if (editing === "coin_values") {
          await setDoc(doc(db, "settings", "coin_values"), coinValues, {
            merge: true,
          });
        } else if (editing === "bot_setting") {
        await setDoc(doc(db, "settings", "bot_setting"), botSettingData);
      } else if (editing === "developer_profile") {
          await setDoc(
            doc(db, "settings", "developer_profile"),
            developerData,
            { merge: true },
          );
        } else if (editing === "support") {
          await setDoc(
            doc(db, "settings", "support"),
            { agents: supportAgents.filter((a) => a.name.trim() !== "") },
            { merge: true },
          );
        } else if (editing === "vip_plan") {
          await setDoc(
            doc(db, "settings", "vip_plans"),
            {
              plans: vipPlans.filter(
                (p) => (p.title || p.name || "").trim() !== "",
              ),
            },
            { merge: true },
          );
        } else {
          await setDoc(
            doc(db, "settings", editing),
            { content: editContent },
            { merge: true },
          );
        }
        alert("Saved!");
        if (!stayOpen) setEditing(null);
      } catch (e) {
        console.warn("Save error", e);
        try {
          if (editing === "ads_rewards_config") {
            await setDoc(doc(db, "settings", "ads_config"), adsConfig, { merge: true });
            await setDoc(doc(db, "settings", "rewards_config"), rewardsConfig, { merge: true });
          } else if (editing === "coin_values") {
            await setDoc(doc(db, "settings", "coin_values"), coinValues);
          } else if (editing === "developer_profile") {
            await setDoc(
              doc(db, "settings", "developer_profile"),
              developerData,
            );
          } else if (editing === "support") {
            await setDoc(doc(db, "settings", "support"), {
              agents: supportAgents.filter((a) => a.name.trim() !== ""),
            });
          } else if (editing === "vip_plan") {
            await setDoc(doc(db, "settings", "vip_plans"), {
              plans: vipPlans.filter(
                (p) => (p.title || p.name || "").trim() !== "",
              ),
            });
          } else {
            await setDoc(doc(db, "settings", editing), {
              content: editContent,
            });
          }
          alert("Saved!");
          if (!stayOpen) setEditing(null);
        } catch (err) {
          alert("Failed to save");
        }
      }
    }
  };

  if (editing) {
    if (editing === "coin_values") {
      return (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setEditing(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Edit Coin Values</h2>
          </div>
          <p className="text-sm text-gray-400 mb-6">
            Set the value of 1 VA coin in different currencies.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(coinValues).map((currency) => (
              <div
                key={currency}
                className="bg-[#151A23] border border-white/5 rounded-xl p-4 flex items-center justify-between"
              >
                <span className="font-bold text-white uppercase">
                  {currency}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">1 VA =</span>
                  <input
                    type="number"
                    step="any"
                    value={coinValues[currency]}
                    onChange={(e) =>
                      setCoinValues({
                        ...coinValues,
                        [currency]: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="bg-[#0B0E14] border border-white/10 rounded-lg px-3 py-1.5 text-white w-32 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
          >
            Save Coin Values
          </button>
        </div>
      );
    }

    if (editing === "bot_setting") {
      return (
        <div className="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Bot Setting</h2>
          </div>
          <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Bot Username</label>
              <input type="text" value={botSettingData.botUsername || ""} onChange={(e) => setBotSettingData({...botSettingData, botUsername: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. MySuperBot" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Bot Token</label>
              <input type="text" value={botSettingData.botToken || ""} onChange={(e) => setBotSettingData({...botSettingData, botToken: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="123456:ABC-DEF..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Mini App Link</label>
              <input type="text" value={botSettingData.miniAppUrl || ""} onChange={(e) => setBotSettingData({...botSettingData, miniAppUrl: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="https://t.me/MyBot/app" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Referral 'How it Works' Link</label>
              <input type="text" value={botSettingData.referralHowItWorksLink || ""} onChange={(e) => setBotSettingData({...botSettingData, referralHowItWorksLink: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="https://t.me/mychannel/post" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Hosting Link</label>
              <input type="text" value={botSettingData.botHostingLink || ""} onChange={(e) => setBotSettingData({...botSettingData, botHostingLink: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="https://my-app.com" />
            </div>
            <button onClick={() => handleSave(false)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">
              Save Settings
            </button>
          </div>
        </div>
      );
    }


    if (editing === "ads_rewards_config") {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center space-x-4 mb-6">
            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white"><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-bold">Ad & Rewards Settings</h2>
          </div>
          
          <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
            <button
              onClick={() => setAdsTab("general")}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${adsTab === "general" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              General Settings
            </button>
            <button
              onClick={() => setAdsTab("config")}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${adsTab === "config" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Ads Configs
            </button>
          </div>

          <div className="bg-[#151A23] rounded-2xl p-6 border border-white/5 shadow-xl space-y-4">
            {adsTab === "general" ? (
              <>
                <div className="flex items-center justify-between bg-[#0B0E14] border border-white/10 rounded-lg p-4 mb-4">
                  <div>
                    <span className="text-white block font-medium">Enable Ads System</span>
                    <span className="text-gray-500 text-xs">Turn ad viewing on or off globally.</span>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${adsConfig?.adsEnabled ? "bg-blue-600" : "bg-gray-600"}`}
                    onClick={() => setAdsConfig({ ...adsConfig, adsEnabled: !adsConfig?.adsEnabled })}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${adsConfig?.adsEnabled ? "left-7" : "left-1"}`} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Daily Ads Limit (per user)</label>
                  <input type="number" value={adsConfig?.dailyAdsLimit || 0} onChange={(e) => setAdsConfig({...adsConfig, dailyAdsLimit: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Ad Watch Duration (seconds)</label>
                  <input type="number" value={adsConfig?.adWatchDuration || 0} onChange={(e) => setAdsConfig({...adsConfig, adWatchDuration: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Reward Per Ad (Coins)</label>
                  <input type="number" value={adsConfig?.rewardPerAd || 0} onChange={(e) => setAdsConfig({...adsConfig, rewardPerAd: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
                </div>
                <div className="pt-4 border-t border-white/10">
                  <label className="block text-xs font-bold text-gray-400 mb-1">Daily Bonus Claim Reward (Coins)</label>
                  <input type="number" value={rewardsConfig?.dailyBonusReward || 0} onChange={(e) => setRewardsConfig({...rewardsConfig, dailyBonusReward: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">VIP Bonus Multiplier</label>
                  <input type="number" step="0.1" value={rewardsConfig?.vipBonusMultiplier || 1} onChange={(e) => setRewardsConfig({...rewardsConfig, vipBonusMultiplier: Number(e.target.value)})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Direct Link URL</label>
                  <input type="text" value={adsConfig?.monetagZoneId || ""} onChange={(e) => setAdsConfig({...adsConfig, monetagZoneId: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. https://directlink..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Monetag Script URL (In-App Ad)</label>
                  <input type="text" value={adsConfig?.monetagScriptUrl || ""} onChange={(e) => setAdsConfig({...adsConfig, monetagScriptUrl: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. //thubanoa.com/1?z=12345" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Monetag SDK Function Name</label>
                  <input type="text" value={adsConfig?.monetagSdk || ""} onChange={(e) => setAdsConfig({...adsConfig, monetagSdk: e.target.value})} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-sm text-white" placeholder="e.g. show_9955574" />
                </div>
              </>
            )}
            <button onClick={() => handleSave(false)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">
              Save Settings
            </button>
          </div>
        </div>
      );
    }

    if (editing === "developer_profile") {
      return (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setEditing(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Edit Developer Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Photo URL
              </label>
              <input
                type="text"
                value={developerData.image || ""}
                onChange={(e) =>
                  setDeveloperData({ ...developerData, image: e.target.value })
                }
                className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Name
              </label>
              <input
                type="text"
                value={developerData.name || ""}
                onChange={(e) =>
                  setDeveloperData({ ...developerData, name: e.target.value })
                }
                className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Title / Role
              </label>
              <input
                type="text"
                value={developerData.role || ""}
                onChange={(e) =>
                  setDeveloperData({ ...developerData, role: e.target.value })
                }
                className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Description
              </label>
              <textarea
                value={developerData.description || ""}
                onChange={(e) =>
                  setDeveloperData({
                    ...developerData,
                    description: e.target.value,
                  })
                }
                className="w-full h-24 bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                Telegram URL
              </label>
              <input
                type="text"
                value={developerData.telegram || ""}
                onChange={(e) =>
                  setDeveloperData({
                    ...developerData,
                    telegram: e.target.value,
                  })
                }
                className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">
                WhatsApp URL
              </label>
              <input
                type="text"
                value={developerData.whatsapp || ""}
                onChange={(e) =>
                  setDeveloperData({
                    ...developerData,
                    whatsapp: e.target.value,
                  })
                }
                className="w-full bg-[#151A23] border border-white/10 rounded-xl p-3 text-white focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
          >
            Save Developer Profile
          </button>
        </div>
      );
    }

    if (editing === "support") {
      return (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setEditing(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">Edit Help & Support</h2>
          </div>

          <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
            <button
              onClick={() => {
                const newId = Date.now();
                setEditSupportId(newId);
                setSupportAgents([
                  ...supportAgents.filter((a) => a.name.trim() !== ""),
                  {
                    id: newId,
                    name: "",
                    role: "",
                    image: "",
                    action: "",
                    link: "",
                    color: "blue",
                  },
                ]);
                setAdminTab("add");
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "add" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Add
            </button>
            <button
              onClick={() => {
                setSupportAgents(
                  supportAgents.filter((a) => a.name.trim() !== ""),
                );
                setAdminTab("added");
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "added" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Added
            </button>
          </div>

          {adminTab === "added" && (
            <div className="bg-[#151A23] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1C2331] text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Photo</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {supportAgents.map((agent) => (
                    <tr key={agent.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <img
                          src={
                            agent.image ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${agent.name || "A"}`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover bg-gray-800"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {agent.name || "Unnamed Agent"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditSupportId(agent.id);
                              setAdminTab("add");
                            }}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this agent?")) {
                                setSupportAgents(
                                  supportAgents.filter(
                                    (a) => a.id !== agent.id,
                                  ),
                                );
                              }
                            }}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {supportAgents.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No support agents added. Click "Add" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={() => handleSave(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
                >
                  Save Changes to Database
                </button>
              </div>
            </div>
          )}

          {adminTab === "add" && (
            <div className="space-y-6">
              {supportAgents
                .filter((a) => a.id === editSupportId)
                .map((agent) => {
                  const index = supportAgents.findIndex(
                    (a) => a.id === agent.id,
                  );
                  return (
                    <div
                      key={agent.id}
                      className="bg-[#151A23] border border-white/10 rounded-xl p-6 relative shadow-lg"
                    >
                      <h3 className="text-lg font-bold text-white mb-6">
                        Edit Support Agent
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={agent.name}
                            onChange={(e) => {
                              const newAgents = [...supportAgents];
                              newAgents[index].name = e.target.value;
                              setSupportAgents(newAgents);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Role (e.g. Technical Assistant)
                          </label>
                          <input
                            type="text"
                            value={agent.role}
                            onChange={(e) => {
                              const newAgents = [...supportAgents];
                              newAgents[index].role = e.target.value;
                              setSupportAgents(newAgents);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Photo URL
                          </label>
                          <input
                            type="text"
                            value={agent.image}
                            onChange={(e) => {
                              const newAgents = [...supportAgents];
                              newAgents[index].image = e.target.value;
                              setSupportAgents(newAgents);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Action Button Text
                          </label>
                          <input
                            type="text"
                            value={agent.action}
                            onChange={(e) => {
                              const newAgents = [...supportAgents];
                              newAgents[index].action = e.target.value;
                              setSupportAgents(newAgents);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Button URL (Link)
                          </label>
                          <input
                            type="text"
                            value={agent.link}
                            onChange={(e) => {
                              const newAgents = [...supportAgents];
                              newAgents[index].link = e.target.value;
                              setSupportAgents(newAgents);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Color Theme
                          </label>
                          <select
                            value={agent.color}
                            onChange={(e) => {
                              const newAgents = [...supportAgents];
                              newAgents[index].color = e.target.value;
                              setSupportAgents(newAgents);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          >
                            <option value="blue">
                              Blue (Telegram/General)
                            </option>
                            <option value="green">
                              Green (WhatsApp/Group)
                            </option>
                            <option value="red">Red (Email/Urgent)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    const currentAgent = supportAgents.find(
                      (a) => a.id === editSupportId,
                    );
                    if (!currentAgent?.name.trim()) {
                      alert("Please enter a name before saving.");
                      return;
                    }
                    await handleSave(true);
                    setAdminTab("added");
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setSupportAgents(
                      supportAgents.filter((a) => a.name.trim() !== ""),
                    );
                    setAdminTab("added");
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
                >
                  Back to List
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    if (editing === "vip_plan") {
      return (
        <div className="space-y-6 max-w-4xl">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => setEditing(null)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">VIP Plan Management</h2>
          </div>

          <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
            <button
              onClick={() => {
                const newId = Date.now();
                setEditVipId(newId);
                setVipPlans([
                  ...vipPlans.filter(
                    (p) => (p.title || p.name || "").trim() !== "",
                  ),
                  {
                    id: newId,
                    name: "",
                    title: "",
                    photo: "",
                    duration: 30,
                    coin: 299,
                    currency: "৳",
                    buttonText: "Buy Plan",
                    buttonColor: "from-amber-500 to-orange-500",
                    themeColor: "amber",
                    animationStyle: "glow",
                    status: "active",
                    sortOrder: 1,
                    features: [],
                  },
                ]);
                setAdminTab("add");
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "add" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Add
            </button>
            <button
              onClick={() => {
                setVipPlans(
                  vipPlans.filter(
                    (p) => (p.title || p.name || "").trim() !== "",
                  ),
                );
                setAdminTab("added");
              }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${adminTab === "added" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              Added
            </button>
          </div>

          {adminTab === "added" && (
            <div className="bg-[#151A23] rounded-xl border border-white/5 overflow-hidden">
              <table className="w-full text-left text-sm text-gray-400">
                <thead className="bg-[#1C2331] text-gray-300 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Photo</th>
                    <th className="px-6 py-4">Plan Title</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {vipPlans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-white/[0.02]">
                      <td className="px-6 py-4">
                        <img
                          src={
                            plan.photo ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${plan.title || plan.name || "VIP"}`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover bg-gray-800"
                        />
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        {plan.title || plan.name || "Unnamed Plan"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setEditVipId(plan.id);
                              setAdminTab("add");
                            }}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this VIP plan?")) {
                                setVipPlans(
                                  vipPlans.filter((p) => p.id !== plan.id),
                                );
                              }
                            }}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {vipPlans.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No VIP Plans added. Click "Add" to start.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="p-4 border-t border-white/5">
                <button
                  onClick={() => handleSave(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
                >
                  Save Changes to Database
                </button>
              </div>
            </div>
          )}

          {adminTab === "add" && (
            <div className="space-y-6">
              {vipPlans
                .filter((p) => p.id === editVipId)
                .map((plan) => {
                  const index = vipPlans.findIndex((p) => p.id === plan.id);
                  return (
                    <div
                      key={plan.id}
                      className="bg-[#151A23] border border-white/10 rounded-xl p-6 relative shadow-lg"
                    >
                      <h3 className="text-lg font-bold text-white mb-6">
                        Edit VIP Plan
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Plan Title
                          </label>
                          <input
                            type="text"
                            value={plan.title || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].title = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div className="md:col-span-1">
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Top Banner Image URL
                          </label>
                          <input
                            type="text"
                            value={plan.photo || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].photo = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Duration (Days)
                          </label>
                          <input
                            type="number"
                            value={plan.duration || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].duration = Number(e.target.value);
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Price
                          </label>
                          <input
                            type="number"
                            value={plan.coin || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].coin = Number(e.target.value);
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Currency Symbol (e.g. ৳)
                          </label>
                          <input
                            type="text"
                            value={plan.currency || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].currency = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={plan.buttonText || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].buttonText = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Button Color (Tailwind classes)
                          </label>
                          <input
                            type="text"
                            value={plan.buttonColor || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].buttonColor = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Theme Color
                          </label>
                          <input
                            type="text"
                            value={plan.themeColor || ""}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].themeColor = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Animation Style
                          </label>
                          <select
                            value={plan.animationStyle || "glow"}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].animationStyle = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          >
                            <option value="glow">Glow Animation</option>
                            <option value="float">Floating Animation</option>
                            <option value="pulse">Pulse Animation</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Status
                          </label>
                          <select
                            value={plan.status || "active"}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].status = e.target.value;
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-400 mb-1">
                            Sort Order
                          </label>
                          <input
                            type="number"
                            value={plan.sortOrder || 0}
                            onChange={(e) => {
                              const newPlans = [...vipPlans];
                              newPlans[index].sortOrder = Number(
                                e.target.value,
                              );
                              setVipPlans(newPlans);
                            }}
                            className="w-full bg-[#0B0E14] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                          />
                        </div>
                      </div>

                      <div className="bg-[#0B0E14] rounded-lg p-4 border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <label className="block text-sm font-bold text-gray-300">
                            Features List
                          </label>
                          <button
                            onClick={() => {
                              const newPlans = [...vipPlans];
                              if (!newPlans[index].features)
                                newPlans[index].features = [];
                              newPlans[index].features.push({
                                id: Date.now(),
                                text: "",
                              });
                              setVipPlans(newPlans);
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1"
                          >
                            <Plus className="w-3 h-3" />{" "}
                            <span>Add Feature</span>
                          </button>
                        </div>
                        <div className="space-y-2">
                          {plan.features?.map(
                            (feature: any, fIndex: number) => (
                              <div
                                key={feature.id}
                                className="flex items-center space-x-3"
                              >
                                <span className="w-6 h-6 rounded-md bg-[#1C2331] text-gray-400 flex items-center justify-center text-xs font-bold">
                                  {fIndex + 1}
                                </span>
                                <input
                                  type="text"
                                  value={feature.text}
                                  onChange={(e) => {
                                    const newPlans = [...vipPlans];
                                    newPlans[index].features[fIndex].text =
                                      e.target.value;
                                    setVipPlans(newPlans);
                                  }}
                                  className="flex-1 bg-[#1C2331] border border-white/10 rounded-lg p-2 text-white focus:outline-none text-sm"
                                  placeholder="Enter feature description..."
                                />
                                <button
                                  onClick={() => {
                                    const newPlans = [...vipPlans];
                                    newPlans[index].features = newPlans[
                                      index
                                    ].features.filter(
                                      (_: any, i: number) => i !== fIndex,
                                    );
                                    setVipPlans(newPlans);
                                  }}
                                  className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ),
                          )}
                          {(!plan.features || plan.features.length === 0) && (
                            <p className="text-gray-500 text-xs text-center py-2">
                              No features added yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div className="flex space-x-3">
                <button
                  onClick={async () => {
                    const currentPlan = vipPlans.find(
                      (p) => p.id === editVipId,
                    );
                    if (
                      !(currentPlan?.title || currentPlan?.name || "").trim()
                    ) {
                      alert("Please enter a plan title before saving.");
                      return;
                    }
                    await handleSave(true);
                    setAdminTab("added");
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setVipPlans(
                      vipPlans.filter(
                        (p) => (p.title || p.name || "").trim() !== "",
                      ),
                    );
                    setAdminTab("added");
                  }}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl text-white font-bold shadow-md transition-colors"
                >
                  Back to List
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }
    return (
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={() => setEditing(null)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Edit Content</h2>
        </div>
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-64 bg-[#151A23] border border-white/10 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-blue-500"
          placeholder="Type Markdown or plain text here..."
        />
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-medium shadow-md"
        >
          Save Content
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6 text-white tracking-tight">
        App Content & Settings
      </h2>
      <p className="text-gray-400 text-sm mb-6 max-w-2xl">
        Manage all customizable content shown in the user's Profile/Menu screen.
        Update terms, guidelines, about pages, and other localized texts here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            label: "Developer Profile",
            key: "developer_profile",
            desc: "Set developer details and social links",
            icon: "👨‍💻",
          },
          {
            label: "Help & Support",
            key: "support",
            desc: "Manage support agents",
            icon: "🎧",
          },
          {
            label: "VIP Plan",
            key: "vip_plan",
            desc: "Setup VIP subscription tiers and benefits",
            icon: "👑",
          },
          {
            label: "Coin Values",
            key: "coin_values",
            desc: "Set conversion rates for methods",
            icon: "💱",
          },
          {
            label: "Ads & Rewards Settings",
            key: "ads_rewards_config",
            desc: "Configure ads limits and reward bonuses",
            icon: "💸",
          },
          {
            label: "Bot Setting",
            key: "bot_setting",
            desc: "Configure telegram bot integration",
            icon: "🤖",
          },
        ].map((section) => (
          <div
            key={section.key}
            className="bg-[#151A23] p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors group"
          >
            <div className="flex items-start space-x-3 mb-4">
              <span className="text-2xl">{section.icon}</span>
              <div>
                <h3 className="font-bold text-white text-base">
                  {section.label}
                </h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                  {section.desc}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleEdit(section.key)}
              className="w-full py-2.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-xl transition-colors text-sm font-bold border border-blue-600/20 group-hover:border-blue-600/40"
            >
              Edit Content
            </button>
          </div>
        ))}
      </div>
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
        snapshot.docs.forEach((docSnap) => {
          subsArray.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Sort pending first
        subsArray.sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return 0;
        });
        setSubmissions(subsArray);
      } else {
        setSubmissions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (
    id: string,
    newStatus: string,
    userId: string,
    reward: number,
  ) => {
    try {
      await updateDoc(doc(db, "task_submissions", id), { status: newStatus });
      if (newStatus === "approved" && userId) {
        const userRef = doc(db, "users", userId.toString());
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          await updateDoc(userRef, {
            vaBalance: (userData.vaBalance || 0) + reward,
          });
        }
        alert(`Submission approved! ${reward} VA rewarded to user.`);
      } else if (newStatus === "rejected") {
        alert("Submission rejected.");
      }
    } catch (e) {
      console.error(e);
      alert("Error updating status.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight">
          Task Submissions Review
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="bg-[#151A23] rounded-2xl border border-white/5 p-5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                  {(sub.username || "U").substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">
                    {sub.username || "Unknown User"}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {new Date(sub.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${sub.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : sub.status === "approved" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}
              >
                {sub.status || "pending"}
              </span>
            </div>

            <div className="bg-[#0B0E14] rounded-xl p-3 mb-4 border border-white/5 flex-1">
              <p className="text-sm font-bold text-gray-200 mb-1">
                {sub.taskTitle}
              </p>
              <p className="text-xs text-yellow-400 font-bold mb-3">
                Reward: {sub.reward} VA
              </p>

              <div className="text-xs text-gray-400 mb-2">
                <span className="text-gray-500">Note:</span>{" "}
                {sub.note || "No notes provided."}
              </div>
                            {sub.profileLink && (
                <a
                  href={sub.profileLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-blue-400 hover:text-blue-300 font-medium mb-3"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Profile / Proof Link</span>
                </a>
              )}
              {sub.imageUrls && sub.imageUrls.length > 0 && (
                <div className="flex space-x-2 mt-2">
                  {sub.imageUrls.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors">
                      <img src={url} alt={`Proof ${i+1}`} className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {sub.status === "pending" && (
              <div className="flex space-x-3 mt-auto">
                <button
                  onClick={() =>
                    handleStatusUpdate(
                      sub.id,
                      "approved",
                      sub.userId,
                      sub.reward,
                    )
                  }
                  className="flex-1 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl font-bold transition-colors border border-green-500/30 text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(sub.id, "rejected", sub.userId, 0)
                  }
                  className="flex-1 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-bold transition-colors border border-red-500/30 text-sm"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
        {submissions.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500 bg-[#151A23] rounded-2xl border border-white/5">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium text-lg">No submissions pending.</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "normal" | "vip">("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "inactive" | "banned">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [coinAmount, setCoinAmount] = useState<number | "">("");
  const [coinAction, setCoinAction] = useState<"add" | "remove">("add");

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsub = onSnapshot(usersRef, (snap) => {
      const u: any[] = [];
      snap.docs.forEach((doc) => {
        u.push({ id: doc.id, ...doc.data() });
      });
      setUsers(u);
    });
    return () => unsub();
  }, []);

  const filteredUsers = users.filter((u) => {
    // Check VIP vs Normal
    const isVip = u.isVip === true;
    if (activeTab === "vip" && !isVip) return false;
    if (activeTab === "normal" && isVip) return false;
    // if activeTab === "all" do nothing


    // Check Status Filter
    const uStatus = u.status || "active"; // "banned", "active"
    if (userStatusFilter === "banned" && uStatus !== "banned") return false;
    if (userStatusFilter === "active" && uStatus !== "active") return false;
    // For inactive, let's assume they haven't logged in recently or it's a special status
    if (userStatusFilter === "inactive" && uStatus !== "inactive") return false;

    // Check Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchName = u.username?.toLowerCase().includes(query);
      const matchId = u.uid?.toLowerCase().includes(query);
      if (!matchName && !matchId) return false;
    }

    return true;
  });

  const handleUpdateCoins = async () => {
    if (!selectedUser || typeof coinAmount !== "number" || coinAmount <= 0)
      return;
    try {
      const userRef = doc(db, "users", selectedUser.id);
      const currentCoins = selectedUser.vaBalance || 0;
      const newCoins =
        coinAction === "add"
          ? currentCoins + coinAmount
          : Math.max(0, currentCoins - coinAmount);
      await updateDoc(userRef, { vaBalance: newCoins });

      // Update local state temporarily so UI reflects before snap
      setSelectedUser({ ...selectedUser, vaBalance: newCoins });
      setCoinAmount("");
      alert(`Successfully updated coins! New balance: ${newCoins}`);
    } catch (e) {
      console.error(e);
      alert("Error updating coins");
    }
  };

  const handleToggleBan = async () => {
    if (!selectedUser) return;
    try {
      const userRef = doc(db, "users", selectedUser.id);
      const isBanned = selectedUser.status === "banned";
      await updateDoc(userRef, { status: isBanned ? "active" : "banned" });
      setSelectedUser({
        ...selectedUser,
        status: isBanned ? "active" : "banned",
      });
      alert(`User ${isBanned ? "Unbanned" : "Banned"} successfully!`);
    } catch (e) {
      console.error(e);
      alert("Error updating status");
    }
  };

  const handleToggleAdmin = async () => {
    if (!selectedUser) return;
    if (selectedUser.role === "super_admin") {
      alert("Cannot modify super_admin role.");
      return;
    }
    try {
      const userRef = doc(db, "users", selectedUser.id);
      const isAdmin = selectedUser.role === "admin";
      await updateDoc(userRef, { role: isAdmin ? "user" : "admin" });
      setSelectedUser({
        ...selectedUser,
        role: isAdmin ? "user" : "admin",
      });
      alert(`User is now ${isAdmin ? "User" : "Admin"}!`);
    } catch (e) {
      console.error(e);
      alert("Error updating role");
    }
  };

  if (selectedUser) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSelectedUser(null)}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
          <h2 className="text-xl font-bold tracking-tight">User Details</h2>
        </div>

        <div className="bg-[#151A23] rounded-2xl border border-white/5 p-6 shadow-lg">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl border-2 border-blue-500/30">
              {(selectedUser.username || "U").substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">
                {selectedUser.username || "Unknown"}
              </h3>
              <p className="text-gray-400 text-sm">ID: {selectedUser.uid}</p>
              <div className="flex space-x-2 mt-2">
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${selectedUser.role === "vip" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}
                >
                  {selectedUser.role === "vip" ? "VIP" : "Normal"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold ${selectedUser.status === "banned" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}
                >
                  {selectedUser.status === "banned" ? "Banned" : "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Coin Balance</p>
              <p className="text-xl font-black text-yellow-400">
                {selectedUser.vaBalance || 0}{" "}
                <span className="text-sm">VA</span>
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Total Earned</p>
              <p className="text-xl font-black text-green-400">
                {selectedUser.totalEarned || 0}{" "}
                <span className="text-sm">VA</span>
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Total Referrals</p>
              <p className="text-xl font-black text-blue-400">
                {selectedUser.referralCount || 0}
              </p>
            </div>
            <div className="bg-[#0B0E14] rounded-xl p-4 border border-white/5">
              <p className="text-gray-500 text-xs mb-1">Ads Watched</p>
              <p className="text-xl font-black text-purple-400">
                {selectedUser.dailyAdsWatched || 0}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                <span className="text-yellow-400">🪙</span>
                <span>Manage Coins</span>
              </h4>
              <div className="flex items-center space-x-3">
                <select
                  value={coinAction}
                  onChange={(e) => setCoinAction(e.target.value as any)}
                  className="bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none w-32"
                >
                  <option value="add">Add (+)</option>
                  <option value="remove">Remove (-)</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={coinAmount}
                  onChange={(e) =>
                    setCoinAmount(parseInt(e.target.value) || "")
                  }
                  className="flex-1 bg-[#0B0E14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                />
                <button
                  onClick={handleUpdateCoins}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                >
                  Update
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h4 className="font-bold text-white mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4 text-red-400" />
                <span>Account Actions</span>
              </h4>
              <button
                onClick={handleToggleBan}
                className={`px-6 py-3 rounded-xl font-bold transition-colors w-full ${selectedUser.status === "banned" ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-red-500/20 text-red-400 hover:bg-red-500/30"}`}
              >
                {selectedUser.status === "banned" ? "Unban User" : "Ban User"}
              </button>
              <button
                onClick={handleToggleAdmin}
                className={`px-6 py-3 rounded-xl font-bold transition-colors w-full mt-3 ${selectedUser.role === "admin" ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30" : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"}`}
              >
                {selectedUser.role === "admin" ? "Remove Admin" : "Make Admin"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
        <h2 className="text-xl font-bold tracking-tight">Users & VIP</h2>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#151A23] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500 w-full sm:w-64"
          />
          <select
            value={userStatusFilter}
            onChange={(e) => setUserStatusFilter(e.target.value as any)}
            className="bg-[#151A23] border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none w-full sm:w-auto"
          >
            <option value="all">All Status</option>
            <option value="active">Active User</option>
            <option value="inactive">Inactive User</option>
            <option value="banned">Block User</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-2 bg-[#151A23] p-1.5 rounded-xl border border-white/5 w-fit">
        
        <button
          onClick={() => setActiveTab("all")}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "all" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
        >
          All Users
        </button>
<button
          onClick={() => setActiveTab("normal")}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "normal" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
        >
          Normal Users
        </button>
        <button
          onClick={() => setActiveTab("vip")}
          className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === "vip" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
        >
          VIP Users
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {filteredUsers.map((u) => (
          <div
            key={u.id}
            className="bg-[#151A23] rounded-2xl border border-white/5 p-4 flex items-center justify-between hover:border-white/10 transition-colors shadow-sm"
          >
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="w-12 h-12 shrink-0 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30 overflow-hidden">
                {u.photoUrl ? <img src={u.photoUrl} alt={u.username} className="w-full h-full object-cover"/> : (u.username || "U").substring(0, 2).toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-bold text-white text-base truncate">
                  {u.username || "Unknown"} {u.isVip && <span className="ml-1 text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-500 rounded font-black">VIP</span>}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 ml-4">

              <button
                onClick={() => setSelectedUser(u)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-md shadow-blue-600/20"
              >
                Action
              </button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500">
            No {activeTab} users found.
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
    if (!name.trim()) return alert("Name is required");
    if (target <= 0) return alert("Target must be greater than 0");
    if (coin <= 0) return alert("Coin reward must be greater than 0");

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
        alert("Achievement updated!");
      } else {
        await addDoc(collection(db, "achievements"), {
          ...achievementData,
          createdAt: Date.now(),
        });
        alert("Achievement added!");
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
      alert("Error saving achievement");
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this achievement?")) {
      await deleteDoc(doc(db, "achievements", id));
    }
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

function AdminRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [activeType, setActiveType] = useState<"deposit" | "withdraw">("deposit");
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
        <div className="flex space-x-2 bg-[#151A23] p-1.5 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => setActiveType("deposit")}
            className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            Deposits
          </button>
          <button
            onClick={() => setActiveType("withdraw")}
            className={`whitespace-nowrap px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeType === "withdraw" ? "bg-purple-600 text-white shadow-md" : "text-gray-400 hover:text-white"}`}
          >
            Withdrawals
          </button>
        </div>
        <div className="flex space-x-2 bg-[#151A23] p-1.5 rounded-xl border border-white/5 w-fit">
          <button
            onClick={() => setActiveStatus("pending")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeStatus === "pending" ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30" : "text-gray-400 hover:text-white border border-transparent"}`}
          >
            Pending
          </button>
          <button
            onClick={() => setActiveStatus("completed")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeStatus === "completed" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-400 hover:text-white border border-transparent"}`}
          >
            Approved
          </button>
          <button
            onClick={() => setActiveStatus("rejected")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeStatus === "rejected" ? "bg-red-500/20 text-red-400 border border-red-500/30" : "text-gray-400 hover:text-white border border-transparent"}`}
          >
            Rejected
          </button>
        </div>
      </div>
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
              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' : req.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
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
    </div>
  );
}
