const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const targetTgLogin = `            // Update photoUrl if available for existing user
            if (tgUser.photo_url) {
              await updateDoc(doc(db, 'users', userCredential.user.uid), { 
                 photoUrl: tgUser.photo_url
              });
            }`;

const replacementTgLogin = `            // Ensure document exists and update photoUrl
            const { getDoc } = await import("firebase/firestore");
            const userRef = doc(db, 'users', userCredential.user.uid);
            const snap = await getDoc(userRef);
            if (!snap.exists()) {
                const tgUserData = {
                    uid: userCredential.user.uid,
                    telegramId: tgUser.id.toString(),
                    fullName: \`\${tgUser.first_name || ''} \${tgUser.last_name || ''}\`.trim(),
                    username: tgUser.username || tgUser.first_name || 'TG_User',
                    photoUrl: tgUser.photo_url || '',
                    role: "user", 
                    usdtBalance: 0,
                    vaBalance: 0,
                    currentLevel: 1,
                    totalEarned: 0,
                    referralCount: 0,
                    createdAt: new Date().toISOString()
                };
                await setDoc(userRef, tgUserData);
            } else if (tgUser.photo_url) {
              await updateDoc(userRef, { 
                 photoUrl: tgUser.photo_url
              });
            }`;
            
code = code.replace(targetTgLogin, replacementTgLogin);
fs.writeFileSync('src/pages/Auth.tsx', code);
