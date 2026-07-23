const fs = require('fs');

let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

const fetchReferralsOld = `  useEffect(() => {
    if (!user?.uid) return;
    const fetchReferrals = async () => {
      try {
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("referredBy", "==", user.uid));
        const snap = await getDocs(q);
        setActualReferrals(snap.size);
        
        let earnings = 0;
        // In this simple version we assume standard reward for past ones or we use a fixed multiplier
        // Or if we stored the exact earned, we would use it, but since we didn't, we just multiply
        // A better way is using the current user's isVip logic.
        const reward = (user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now()) ? 275 : 250;
        setActualEarnings(snap.size * reward);
      } catch (e) {
        console.error(e);
      }
    };
    fetchReferrals();
  }, [user]);`;

const fetchReferralsNew = `  useEffect(() => {
    if (!user?.uid) return;
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        const usersRef = m.collection(db, "users");
        const q = m.query(usersRef, m.where("referredBy", "==", user.uid));
        unsub = m.onSnapshot(q, (snap) => {
            setActualReferrals(snap.size);
            const reward = (user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now()) ? 275 : 250;
            setActualEarnings(snap.size * reward);
        });
    });
    return () => unsub();
  }, [user]);`;

const fetchBotSettingOld = `  useEffect(() => {
    const fetchBotSetting = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "bot_setting"));
        if (snap.exists()) {
          setBotSetting(snap.data());
        }
      } catch(e) {}
    };
    fetchBotSetting();
  }, []);`;

const fetchBotSettingNew = `  useEffect(() => {
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        unsub = m.onSnapshot(m.doc(db, "settings", "bot_setting"), (snap) => {
            if (snap.exists()) {
                setBotSetting(snap.data());
            }
        });
    });
    return () => unsub();
  }, []);`;

code = code.replace(fetchReferralsOld, fetchReferralsNew);
code = code.replace(fetchBotSettingOld, fetchBotSettingNew);

fs.writeFileSync('src/pages/Refer.tsx', code);
