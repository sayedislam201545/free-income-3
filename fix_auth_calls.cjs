const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const call1Old = `              let startParam = tg.initDataUnsafe.start_param || inviteCode;
              let referredBy = await handleReferral(startParam);

              const userRef = doc(db, 'users', user.uid);
              await setDoc(userRef, {
                uid: user.uid,
                telegramId: tgUser.id.toString(),
                fullName: \`\${tgUser.first_name || ''} \${tgUser.last_name || ''}\`.trim(),
                username: displayName,
                photoUrl: tgUser.photo_url || '',
                role: "user", 
                usdtBalance: 0,
                vaBalance: 0,
                currentLevel: 1,
                totalEarned: 0,
                referralCount: 0,
                referredBy: referredBy,
                createdAt: new Date().toISOString()
              });`;

const call1New = `              let startParam = tg.initDataUnsafe.start_param || inviteCode;
              let refResult = await handleReferral(startParam);

              const userRef = doc(db, 'users', user.uid);
              await setDoc(userRef, {
                uid: user.uid,
                telegramId: tgUser.id.toString(),
                fullName: \`\${tgUser.first_name || ''} \${tgUser.last_name || ''}\`.trim(),
                username: displayName,
                photoUrl: tgUser.photo_url || '',
                role: "user", 
                usdtBalance: 0,
                vaBalance: refResult.newUserBonus || 0,
                currentLevel: 1,
                totalEarned: refResult.newUserBonus || 0,
                referralCount: 0,
                referredBy: refResult.code,
                createdAt: new Date().toISOString()
              });`;

const call2Old = `        // Handle referral
        let referredBy = await handleReferral(inviteCode);

        await setDoc(userRef, {
          uid: user.uid,
          fullName,
          username,
          phone,
          email,
          referredBy,
          role: "user", 
          usdtBalance: 0,
          vaBalance: 0,
          currentLevel: 1,
          totalEarned: 0,
          referralCount: 0,
          createdAt: new Date().toISOString()
        });`;

const call2New = `        // Handle referral
        let refResult = await handleReferral(inviteCode);

        await setDoc(userRef, {
          uid: user.uid,
          fullName,
          username,
          phone,
          email,
          referredBy: refResult.code,
          role: "user", 
          usdtBalance: 0,
          vaBalance: refResult.newUserBonus || 0,
          currentLevel: 1,
          totalEarned: refResult.newUserBonus || 0,
          referralCount: 0,
          createdAt: new Date().toISOString()
        });`;

code = code.replace(call1Old, call1New);
code = code.replace(call2Old, call2New);
fs.writeFileSync('src/pages/Auth.tsx', code);
