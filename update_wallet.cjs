const fs = require('fs');

let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
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

const newEffect = `  const [adsRewardsSettings, setAdsRewardsSettings] = useState<any>({});
  useEffect(() => {
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
        unsubs.push(m.onSnapshot(m.doc(db, 'settings', 'ads_rewards_config'), (snap) => {
            if (snap.exists()) {
                setAdsRewardsSettings(snap.data()?.settings || {});
            }
        }));
    });
    return () => unsubs.forEach(unsub => unsub());
  }, []);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/Wallet.tsx', code);
