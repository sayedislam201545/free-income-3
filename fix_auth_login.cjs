const fs = require('fs');
let code = fs.readFileSync('src/pages/Auth.tsx', 'utf8');

const target = `      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {`;

const replacement = `      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const { getDoc } = await import("firebase/firestore");
        const userRef = doc(db, 'users', user.uid);
        const snap = await getDoc(userRef);
        
        if (!snap.exists()) {
            // Re-create broken document
            const userData = {
                uid: user.uid,
                fullName: user.displayName || 'User',
                username: user.displayName || 'User',
                phone: '',
                email: user.email,
                role: "user", 
                usdtBalance: 0,
                vaBalance: 0,
                currentLevel: 1,
                totalEarned: 0,
                referralCount: 0,
                createdAt: new Date().toISOString()
            };
            await setDoc(userRef, userData);
        }
      } else {`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Auth.tsx', code);
