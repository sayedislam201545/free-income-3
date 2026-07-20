const fs = require('fs');

let dbTsx = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

// We need to inject state for real data
if (!dbTsx.includes('const [realStats, setRealStats] = useState')) {
    const hookInjectPos = dbTsx.indexOf('const [bonusAdReward]');
    
    const newHooks = `  const [realStats, setRealStats] = useState({
    totalEarned: 0,
    totalTasks: 0,
    totalReferrals: 0,
    dailyStreak: 0,
    completed: 0,
    globalRank: 0,
    activeTasks: 0
  });

  useEffect(() => {
    if (!user) return;
    const fetchRealData = async () => {
      try {
        const { collection, query, where, getDocs, getCountFromServer, orderBy } = await import("firebase/firestore");
        
        // Active Tasks (pending submissions)
        const subQ = query(collection(db, "task_submissions"), where("userId", "==", user.uid), where("status", "==", "pending"));
        const subSnap = await getCountFromServer(subQ);
        const activeTasks = subSnap.data().count;

        // Completed Tasks (approved submissions)
        const compQ = query(collection(db, "task_submissions"), where("userId", "==", user.uid), where("status", "==", "approved"));
        const compSnap = await getCountFromServer(compQ);
        const completed = compSnap.data().count;

        // Global Rank (users with more balance)
        const rankQ = query(collection(db, "users"), where("vaBalance", ">", user.vaBalance || 0));
        const rankSnap = await getCountFromServer(rankQ);
        const globalRank = rankSnap.data().count + 1;

        setRealStats({
          totalEarned: user.totalEarned || 0,
          totalTasks: activeTasks + completed,
          totalReferrals: user.referralCount || 0,
          dailyStreak: user.currentStreak || 0,
          completed: completed,
          globalRank: globalRank,
          activeTasks: activeTasks
        });
      } catch (e) {
        console.warn("Failed to fetch real stats", e);
      }
    };
    fetchRealData();
  }, [user]);

`;
    dbTsx = dbTsx.slice(0, hookInjectPos) + newHooks + dbTsx.slice(hookInjectPos);
    
    // Now replace the hardcoded values in stats array
    dbTsx = dbTsx.replace('value: (user?.totalEarned || 0).toLocaleString(),', 'value: realStats.totalEarned.toLocaleString(),');
    dbTsx = dbTsx.replace('rawValue: user?.totalEarned || 0,', 'rawValue: realStats.totalEarned,');
    
    dbTsx = dbTsx.replace('value: ((user as any)?.totalTasks || 0).toLocaleString(),', 'value: realStats.totalTasks.toLocaleString(),');
    dbTsx = dbTsx.replace('rawValue: (user as any)?.totalTasks || 0,', 'rawValue: realStats.totalTasks,');
    
    dbTsx = dbTsx.replace('value: (user?.referralCount || 0).toLocaleString(),', 'value: realStats.totalReferrals.toLocaleString(),');
    dbTsx = dbTsx.replace('rawValue: user?.referralCount || 0,', 'rawValue: realStats.totalReferrals,');
    
    dbTsx = dbTsx.replace('value: ((user as any)?.currentStreak || 0).toLocaleString(),', 'value: realStats.dailyStreak.toLocaleString(),');
    dbTsx = dbTsx.replace('rawValue: (user as any)?.currentStreak || 0,', 'rawValue: realStats.dailyStreak,');
    
    dbTsx = dbTsx.replace('value: ((user as any)?.pendingTasks || 0).toLocaleString(),', 'value: realStats.activeTasks.toLocaleString(),');
    dbTsx = dbTsx.replace('rawValue: (user as any)?.pendingTasks || 0,', 'rawValue: realStats.activeTasks,');
    
    dbTsx = dbTsx.replace('value: ((user as any)?.completedTasks || 0).toLocaleString(),', 'value: realStats.completed.toLocaleString(),');
    dbTsx = dbTsx.replace('rawValue: (user as any)?.completedTasks || 0,', 'rawValue: realStats.completed,');

    dbTsx = dbTsx.replace('value: `#${(user as any)?.globalRank || 0}`,', 'value: `#${realStats.globalRank}`,');
    dbTsx = dbTsx.replace('rawValue: (user as any)?.globalRank || 0,', 'rawValue: realStats.globalRank,');
    
    fs.writeFileSync('src/pages/Dashboard.tsx', dbTsx);
    console.log('Updated Dashboard.tsx');
}

