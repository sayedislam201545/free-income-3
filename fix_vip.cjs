const fs = require('fs');
let code = fs.readFileSync('src/pages/VIP.tsx', 'utf8');

const oldEffect = `  useEffect(() => {
    const fetchData = async () => {
      try {
        const plansSnap = await getDoc(doc(db, "settings", "vip_plans"));
        if (plansSnap.exists() && plansSnap.data().plans) {
          setPlans(plansSnap.data().plans);
        }

        if (user) {
          const userSnap = await getDoc(doc(db, "users", user.uid));
          if (userSnap.exists()) {
            setUserData(userSnap.data());
          }
        }
      } catch (e) {
        console.error("Error fetching VIP data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);`;

const newEffect = `  useEffect(() => {
    let unsubPlans = () => {};
    let unsubUser = () => {};
    
    import("firebase/firestore").then(m => {
       unsubPlans = m.onSnapshot(m.doc(db, "settings", "vip_plans"), (plansSnap) => {
         if (plansSnap.exists() && plansSnap.data().plans) {
           setPlans(plansSnap.data().plans);
         }
         setLoading(false);
       });
       
       if (user) {
         unsubUser = m.onSnapshot(m.doc(db, "users", user.uid), (userSnap) => {
           if (userSnap.exists()) {
             setUserData(userSnap.data());
           }
         });
       } else {
         setLoading(false);
       }
    });
    
    return () => {
      unsubPlans();
      unsubUser();
    };
  }, [user]);`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/VIP.tsx', code);
