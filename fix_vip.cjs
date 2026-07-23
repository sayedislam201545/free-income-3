const fs = require('fs');
let code = fs.readFileSync('src/pages/VIP.tsx', 'utf8');

const target = `await updateDoc(doc(db, "users", user.uid), {
        vaBalance: increment(-plan.coin),
        isVip: true,
        vipExpiry: expiryDate.getTime(),
      });`;

const replacement = `await updateDoc(doc(db, "users", user.uid), {
        vaBalance: increment(-plan.coin),
        isVip: true,
        vipExpiry: expiryDate.getTime(),
      });
      const { addDoc, collection } = await import("firebase/firestore");
      await addDoc(collection(db, 'transactions'), {
          userId: user.uid.toString(),
          type: 'vip_plan',
          amount: plan.coin,
          status: 'completed',
          createdAt: Date.now(),
          note: \`Purchased \${plan.title}\`
      });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/VIP.tsx', code);
