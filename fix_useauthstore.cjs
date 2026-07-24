const fs = require('fs');
let code = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

code = code.replace(
  /onAuthStateChanged\(auth, async \(firebaseUser\) => \{\n\s*if \(firebaseUser\) \{\n\s*const userRef = doc\(db, 'users', firebaseUser\.uid\);\n\s*onSnapshot\(userRef, \(snapshot\) => \{/g,
  `let userUnsub;\n    onAuthStateChanged(auth, async (firebaseUser) => {\n      if (userUnsub) userUnsub();\n      if (firebaseUser) {\n        const userRef = doc(db, 'users', firebaseUser.uid);\n        userUnsub = onSnapshot(userRef, (snapshot) => {`
);

code = code.replace(
  /\} else \{\n\s*\/\/ Document doesn't exist yet/g,
  `} else {\n            // Document doesn't exist yet`
); // just a check, doesn't matter

// Wait, the regex is fragile. I'll just rewrite the initAuth function entirely.
