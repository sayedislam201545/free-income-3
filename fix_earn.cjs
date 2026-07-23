const fs = require('fs');
let code = fs.readFileSync('src/pages/Earn.tsx', 'utf8');

const target = `await updateDoc(userRef, {
              vaBalance: increment(reward),
              miningStartTime: null,
              miningEndTime: null,
            });`;

const replacement = `await updateDoc(userRef, {
              vaBalance: increment(reward),
              miningStartTime: null,
              miningEndTime: null,
            });
            const { addDoc, collection } = await import("firebase/firestore");
            await addDoc(collection(db, 'transactions'), {
                userId: user.uid.toString(),
                type: 'earn_va',
                amount: reward,
                status: 'completed',
                createdAt: Date.now(),
                note: 'Mining Claim'
            });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Earn.tsx', code);
