const fs = require('fs');
let code = fs.readFileSync('src/pages/Achievements.tsx', 'utf8');

const target = `await updateDoc(userRef, {
            vaBalance: (userDoc.data()?.vaBalance || 0) + achievement.coin,
            claimedAchievements: [...claimedList, achievement.id],
          });`;

const replacement = `await updateDoc(userRef, {
            vaBalance: (userDoc.data()?.vaBalance || 0) + achievement.coin,
            claimedAchievements: [...claimedList, achievement.id],
          });
          const { addDoc } = await import("firebase/firestore");
          await addDoc(collection(db, 'transactions'), {
              userId: user.uid.toString(),
              type: 'achievement',
              amount: achievement.coin,
              status: 'completed',
              createdAt: Date.now(),
              note: \`Claimed \${achievement.title}\`
          });`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Achievements.tsx', code);
