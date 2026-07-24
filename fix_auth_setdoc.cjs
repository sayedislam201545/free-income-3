const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const targetSetDoc = `        await setDoc(userRef, {
          uid: user.uid,
          fullName,
          username,
          phone,
          email,
          referredBy,
          role: "user", 
          usdtBalance: 0,
          vaBalance: referredBy ? 250 : 0,
          currentLevel: 1,
          totalEarned: 0,
          referralCount: 0,
          createdAt: new Date().toISOString()
        });`;

const replacementSetDoc = `        const userData = {
          uid: user.uid,
          fullName,
          username,
          phone,
          email,
          referredBy,
          role: "user", 
          usdtBalance: 0,
          vaBalance: referredBy ? 250 : 0,
          currentLevel: 1,
          totalEarned: 0,
          referralCount: 0,
          createdAt: new Date().toISOString()
        };
        
        let attempts = 0;
        while (attempts < 3) {
          try {
            await setDoc(userRef, userData);
            break;
          } catch (e: any) {
            attempts++;
            if (attempts >= 3) throw e;
            await new Promise(r => setTimeout(r, 1000));
          }
        }`;

code = code.replace(targetSetDoc, replacementSetDoc);

const targetTgSetDoc = `              await setDoc(userRef, {
                uid: user.uid,
                telegramId: tgUser.id.toString(),
                fullName: \`\${tgUser.first_name || ''} \${tgUser.last_name || ''}\`.trim(),
                username: displayName,
                photoUrl: tgUser.photo_url || '',
                role: "user", 
                usdtBalance: 0,
                vaBalance: referredBy ? 250 : 0,
                currentLevel: 1,
                totalEarned: 0,
                referralCount: 0,
                referredBy: referredBy,
                createdAt: new Date().toISOString()
              });`;

const replacementTgSetDoc = `              const tgUserData = {
                uid: user.uid,
                telegramId: tgUser.id.toString(),
                fullName: \`\${tgUser.first_name || ''} \${tgUser.last_name || ''}\`.trim(),
                username: displayName,
                photoUrl: tgUser.photo_url || '',
                role: "user", 
                usdtBalance: 0,
                vaBalance: referredBy ? 250 : 0,
                currentLevel: 1,
                totalEarned: 0,
                referralCount: 0,
                referredBy: referredBy,
                createdAt: new Date().toISOString()
              };
              
              let attempts = 0;
              while (attempts < 3) {
                try {
                  await setDoc(userRef, tgUserData);
                  break;
                } catch (e: any) {
                  attempts++;
                  if (attempts >= 3) throw e;
                  await new Promise(r => setTimeout(r, 1000));
                }
              }`;
              
code = code.replace(targetTgSetDoc, replacementTgSetDoc);

fs.writeFileSync('src/pages/Auth.tsx', code);
