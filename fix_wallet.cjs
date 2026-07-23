const fs = require('fs');
let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    const fetchData = async () => {
      try {
        const methodsSnap = await getDoc(doc(db, 'settings', 'payment_methods'));
        if (methodsSnap.exists()) {
          const data = methodsSnap.data();
          setDepositMethods(data.deposit || []);
          setWithdrawMethods(data.withdraw || []);
        }

        const ratesSnap = await getDoc(doc(db, 'settings', 'coin_values'));
        if (ratesSnap.exists()) {
          setCoinRates(ratesSnap.data());
        }
      } catch (e) {
        console.error("Error fetching wallet config", e);
      }
    };
    fetchData();
  }, []);`;

const newEffect = `  useEffect(() => {
    let unsubs: any[] = [];
    import("firebase/firestore").then(m => {
        unsubs.push(m.onSnapshot(m.doc(db, 'settings', 'payment_methods'), (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                setDepositMethods(data.deposit || []);
                setWithdrawMethods(data.withdraw || []);
            }
        }));
        unsubs.push(m.onSnapshot(m.doc(db, 'settings', 'coin_values'), (snap) => {
            if (snap.exists()) {
                setCoinRates(snap.data());
            }
        }));
    });
    return () => unsubs.forEach(unsub => unsub());
  }, []);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/Wallet.tsx', code);
