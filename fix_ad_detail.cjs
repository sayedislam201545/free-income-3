const fs = require('fs');
let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

const target = `await updateDoc(userRef, {
          [\`adCampaignsWatched.\${id}\`]: {
              dailyWatched: newDaily,
              lastDate: today
          },
          vaBalance: (userData.vaBalance || 0) + addedCoins
        });`;

const replacement = `await updateDoc(userRef, {
          [\`adCampaignsWatched.\${id}\`]: {
              dailyWatched: newDaily,
              lastDate: today
          },
          vaBalance: (userData.vaBalance || 0) + addedCoins
        });
        const { addDoc, collection } = await import("firebase/firestore");
        await addDoc(collection(db, 'transactions'), {
            userId: auth.currentUser.uid.toString(),
            type: 'ads_watched',
            amount: addedCoins,
            status: 'completed',
            createdAt: Date.now(),
            note: 'Ad Watch Reward'
        });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/AdDetail.tsx', code);
