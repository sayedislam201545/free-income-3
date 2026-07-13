const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

code = code.replace(
  `     const fetchHistory = async () => {
         try {
         const histRef = query(collection(db, 'daily_bonus_history'), where('userId', '==', user.uid.toString()));
         const snapshot = await getDocs(histRef);
         if (!snapshot.empty) {
             const docsData = snapshot.docs.map(doc => doc.data()).sort((a, b) => b.date - a.date);
             const lastCheckIn = docsData[0].date;`,
  `     const fetchHistory = async () => {
         try {
         const histRef = query(collection(db, 'daily_bonus_history'), where('userId', '==', user.uid.toString()));
         const snapshot = await getDocs(histRef);
         let lastCheckIn = (user as any).lastCheckIn || 0;
         let docsData: any[] = [];
         if (!snapshot.empty) {
             docsData = snapshot.docs.map(doc => doc.data()).sort((a, b) => b.date - a.date);
             if (docsData[0].date > lastCheckIn) {
                 lastCheckIn = docsData[0].date;
             }
         }
         if (lastCheckIn > 0) {`
);
fs.writeFileSync('src/pages/CheckIn.tsx', code);
