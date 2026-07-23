const fs = require('fs');

let code = fs.readFileSync('src/pages/ReferralsLog.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.uid) return;
      try {
        const inviteCode = user?.uid;
        const usersRef = collection(db, "users");
        // For simplicity, query users who registered using this code
        // We'll need to store 'referredBy' in the user document when they sign up.
        const q = query(
          usersRef,
          where("referredBy", "==", inviteCode)
        );
        const snapshot = await getDocs(q);
        const logData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        // Sort in memory by createdAt descending
        logData.sort((a: any, b: any) => {
          const tA = new Date(a.createdAt || 0).getTime();
          const tB = new Date(b.createdAt || 0).getTime();
          return tB - tA;
        });

        setLogs(logData);
      } catch (error) {
        console.error("Error fetching referral logs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user]);`;

const newEffect = `  useEffect(() => {
    if (!user?.uid) return;
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        const usersRef = m.collection(db, "users");
        const q = m.query(usersRef, m.where("referredBy", "==", user.uid));
        unsub = m.onSnapshot(q, (snapshot) => {
            const logData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            logData.sort((a: any, b: any) => {
                const tA = new Date(a.createdAt || 0).getTime();
                const tB = new Date(b.createdAt || 0).getTime();
                return tB - tA;
            });

            setLogs(logData);
            setLoading(false);
        });
    });
    return () => unsub();
  }, [user]);`;

if (code.includes('const fetchLogs = async () => {')) {
    code = code.replace(oldEffect, newEffect);
    fs.writeFileSync('src/pages/ReferralsLog.tsx', code);
}
