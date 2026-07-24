const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

const target = `export const auth = getAuth(app);
export const storage = getStorage(app);`;

const replace = `import { browserLocalPersistence, setPersistence } from "firebase/auth";

export const auth = getAuth(app);
// Attempt to set local persistence to fix auto-logout issues in Telegram Mini Apps
setPersistence(auth, browserLocalPersistence).catch(err => {
    console.warn("Auth persistence error:", err);
});

export const storage = getStorage(app);`;

code = code.replace(target, replace);
fs.writeFileSync('src/lib/firebase.ts', code);
