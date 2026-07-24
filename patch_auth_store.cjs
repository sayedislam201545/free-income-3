const fs = require('fs');
let code = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');

const target = `  initAuth: () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setStore({ user: snapshot.data() as User, isLoading: false });
          } else {
            // Document doesn't exist yet (or was deleted).
            // Auth.tsx handles creating the initial document during registration.
            // We just wait for the snapshot to trigger again once created.
            setStore({ isLoading: false });
          }
        }, (error) => {
          console.warn("User fetch error:", error);
          setStore({ user: null, isLoading: false });
        });
      } else {
        setStore({ user: null, isLoading: false });
      }
    });
  },`;

const replacement = `  initAuth: () => {
    let userUnsub;
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (userUnsub) {
        userUnsub();
        userUnsub = undefined;
      }
      if (firebaseUser) {
        const userRef = doc(db, 'users', firebaseUser.uid);
        userUnsub = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setStore({ user: snapshot.data() as User, isLoading: false });
          } else {
            setStore({ isLoading: false });
          }
        }, (error) => {
          console.warn("User fetch error:", error);
          setStore({ user: null, isLoading: false });
        });
      } else {
        setStore({ user: null, isLoading: false });
      }
    });
  },`;

code = code.replace(target, replacement);
fs.writeFileSync('src/store/useAuthStore.ts', code);
