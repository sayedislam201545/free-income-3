const fs = require('fs');

let code = fs.readFileSync('src/pages/Notifications.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    if (!user) return;
    const fetchNotices = async () => {
      // 1. Fetch Admin Notices
      try {
        const adminQ = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
        const adminSnap = await getDocs(adminQ);
        setAdminNotices(adminSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch(e) { console.warn("Admin notices", e); }

      // 2. Fetch App/Task History
      try {
        const appQ = query(collection(db, 'task_history'), where('userId', '==', user.uid));
        const appSnap = await getDocs(appQ);
        const docs = appSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAppNotices(docs);
      } catch(e) { console.warn("App notices", e); }

      // 3. Fetch Wallet Transactions
      try {
        const walletQ = query(collection(db, 'transactions'), where('userId', '==', user.uid));
        const walletSnap = await getDocs(walletQ);
        const docs = walletSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setWalletNotices(docs);
      } catch(e) { console.warn("Wallet notices", e); }
    };
    fetchNotices();
  }, [user?.uid]);`;

const newEffect = `  useEffect(() => {
    if (!user) return;
    let unsubs: any[] = [];
    import("firebase/firestore").then(m => {
        const adminQ = m.query(m.collection(db, 'notices'), m.orderBy('createdAt', 'desc'));
        unsubs.push(m.onSnapshot(adminQ, (snap) => {
            setAdminNotices(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        }));
        
        const appQ = m.query(m.collection(db, 'task_history'), m.where('userId', '==', user.uid));
        unsubs.push(m.onSnapshot(appQ, (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            docs.sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
            setAppNotices(docs);
        }));

        const walletQ = m.query(m.collection(db, 'transactions'), m.where('userId', '==', user.uid));
        unsubs.push(m.onSnapshot(walletQ, (snap) => {
            const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            docs.sort((a: any, b: any) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());
            setWalletNotices(docs);
        }));
    });
    return () => unsubs.forEach(unsub => unsub());
  }, [user?.uid]);`;

if (code.includes('const fetchNotices = async () => {')) {
    code = code.replace(oldEffect, newEffect);
    fs.writeFileSync('src/pages/Notifications.tsx', code);
}
