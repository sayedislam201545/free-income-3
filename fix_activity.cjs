const fs = require('fs');
let code = fs.readFileSync('src/pages/Activity.tsx', 'utf8');

const targetState = `  useEffect(() => {
    if (!user) return;
    const txRef = collection(db, "transactions");
    const q = query(txRef, where("userId", "==", user.uid.toString()));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const acts: any[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          acts.push({
            id: doc.id,
            type: data.type || "transaction",
            amount: data.amount || 0,
            status: data.status || "completed",
            date: new Date(
              data.timestamp || data.createdAt || Date.now(),
            ).getTime(),
            note: data.note || "No description",
          });
        });
        // Sort descending by date
        acts.sort((a, b) => b.date - a.date);
        setActivities(acts);
      } else {
        setActivities([]);
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);`;

const replacementState = `  useEffect(() => {
    if (!user) return;

    let acts: any[] = [];
    let unsub1: any, unsub2: any, unsub3: any;

    const mergeActs = (newActs: any[], source: string) => {
        acts = acts.filter(a => a.source !== source).concat(newActs.map(a => ({...a, source})));
        acts.sort((a, b) => b.date - a.date);
        setActivities([...acts]);
    };

    // 1. Transactions
    const txRef = collection(db, "transactions");
    const q1 = query(txRef, where("userId", "==", user.uid.toString()));
    unsub1 = onSnapshot(q1, (snapshot) => {
        const docs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: data.type || "transaction",
                amount: data.amount || 0,
                status: data.status || "completed",
                date: new Date(data.timestamp || data.createdAt || Date.now()).getTime(),
                note: data.note || "Transaction",
            };
        });
        mergeActs(docs, 'tx');
    });

    // 2. Task Claims
    const tcRef = collection(db, "task_claims");
    const q2 = query(tcRef, where("userId", "==", user.uid.toString()));
    unsub2 = onSnapshot(q2, (snapshot) => {
        const docs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: "task",
                amount: data.reward || 0,
                status: "completed",
                date: data.claimedAt || Date.now(),
                note: data.taskTitle || "Completed Task",
            };
        });
        mergeActs(docs, 'tc');
    });

    // 3. Daily Bonus
    const dbRef = collection(db, "daily_bonus_history");
    const q3 = query(dbRef, where("userId", "==", user.uid.toString()));
    unsub3 = onSnapshot(q3, (snapshot) => {
        const docs = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                type: "bonus",
                amount: data.reward || 0,
                status: "completed",
                date: data.date || Date.now(),
                note: "Daily Check-In",
            };
        });
        mergeActs(docs, 'db');
    });

    return () => {
        if (unsub1) unsub1();
        if (unsub2) unsub2();
        if (unsub3) unsub3();
    };
  }, [user?.uid]);`;

code = code.replace(targetState, replacementState);
fs.writeFileSync('src/pages/Activity.tsx', code);
console.log("Activity.tsx updated");
