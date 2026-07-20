const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const dashStart = content.indexOf('function AdminDashboard() {');
const dashEnd = content.indexOf('function AdminTasks() {');

let dashContent = `function AdminDashboard() {
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
          { label: "Total Coins", value: stats.totalCoins.toLocaleString(), icon: "💰" },
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

`;

content = content.slice(0, dashStart) + dashContent + content.slice(dashEnd);
fs.writeFileSync('src/pages/Admin.tsx', content);
