const fs = require('fs');
let code = fs.readFileSync('src/pages/VIP.tsx', 'utf8');

const oldEffect = `       unsubPlans = m.onSnapshot(m.doc(db, "settings", "vip_plans"), (plansSnap) => {
         if (plansSnap.exists() && plansSnap.data().plans) {
           setPlans(plansSnap.data().plans);
         }
         setLoading(false);
       });`;

const newEffect = `       unsubPlans = m.onSnapshot(m.collection(db, "vip_plans"), (snap) => {
         const arr: any[] = [];
         snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
         setPlans(arr);
         setLoading(false);
       });`;

code = code.replace(oldEffect, newEffect);
fs.writeFileSync('src/pages/VIP.tsx', code);
