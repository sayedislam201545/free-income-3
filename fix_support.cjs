const fs = require('fs');

let code = fs.readFileSync('src/pages/Support.tsx', 'utf8');
code = code.replace(/useEffect\(\(\) => \{\s*const fetchSupport = async \(\) => \{\s*try \{\s*const snap = await getDoc\(doc\(db, "settings", "support"\)\);\s*if \(snap\.exists\(\) && snap\.data\(\)\.agents\) \{\s*setSupportAgents\(snap\.data\(\)\.agents\);\s*\}\s*\} catch\(e\) \{\}\s*\};\s*fetchSupport\(\);\s*\}, \[\]\);/, 
`useEffect(() => {
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        unsub = m.onSnapshot(m.doc(db, "settings", "support"), (snap) => {
            if (snap.exists() && snap.data().agents) {
                setSupportAgents(snap.data().agents);
            }
        });
    });
    return () => unsub();
  }, []);`);
fs.writeFileSync('src/pages/Support.tsx', code);
