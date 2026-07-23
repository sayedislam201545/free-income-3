const fs = require('fs');

function fixDeveloper() {
    let code = fs.readFileSync('src/pages/Developer.tsx', 'utf8');
    code = code.replace(/useEffect\(\(\) => \{\s*const fetchDeveloper = async \(\) => \{\s*try \{\s*const snap = await getDoc\(doc\(db, "settings", "developer_profile"\)\);\s*if \(snap\.exists\(\) && snap\.data\(\)\.name\) \{\s*setDeveloperData\(snap\.data\(\)\);\s*\}\s*\} catch\(e\) \{\}\s*\};\s*fetchDeveloper\(\);\s*\}, \[\]\);/, 
    `useEffect(() => {
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        unsub = m.onSnapshot(m.doc(db, "settings", "developer_profile"), (snap) => {
            if (snap.exists() && snap.data().name) {
                setDeveloperData(snap.data());
            }
        });
    });
    return () => unsub();
  }, []);`);
    fs.writeFileSync('src/pages/Developer.tsx', code);
}

function fixSupport() {
    let code = fs.readFileSync('src/pages/Support.tsx', 'utf8');
    code = code.replace(/useEffect\(\(\) => \{\s*const fetchSupport = async \(\) => \{\s*try \{\s*const snap = await getDoc\(doc\(db, "settings", "support"\)\);\s*if \(snap\.exists\(\) && snap\.data\(\)\.agents\) \{\s*setAgents\(snap\.data\(\)\.agents\);\s*\}\s*\} catch\(e\) \{\}\s*\};\s*fetchSupport\(\);\s*\}, \[\]\);/, 
    `useEffect(() => {
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        unsub = m.onSnapshot(m.doc(db, "settings", "support"), (snap) => {
            if (snap.exists() && snap.data().agents) {
                setAgents(snap.data().agents);
            }
        });
    });
    return () => unsub();
  }, []);`);
    fs.writeFileSync('src/pages/Support.tsx', code);
}

function fixRefer() {
    let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');
    code = code.replace(/useEffect\(\(\) => \{\s*const fetchBotLink = async \(\) => \{\s*try \{\s*const snap = await getDoc\(doc\(db, "settings", "bot_setting"\)\);\s*if \(snap\.exists\(\) && snap\.data\(\)\.botUsername\) \{\s*setBotLink\(\`https:\/\/t\.me\/\$\{snap\.data\(\)\.botUsername\}\?start=ref\$\{user\?\.uid\}\`\);\s*\} else \{\s*setBotLink\(\`https:\/\/t\.me\/placeholder_bot\?start=ref\$\{user\?\.uid\}\`\);\s*\}\s*\} catch \(error\) \{\s*setBotLink\(\`https:\/\/t\.me\/placeholder_bot\?start=ref\$\{user\?\.uid\}\`\);\s*\}\s*\};\s*fetchBotLink\(\);\s*\}, \[user\]\);/, 
    `useEffect(() => {
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        unsub = m.onSnapshot(m.doc(db, "settings", "bot_setting"), (snap) => {
            if (snap.exists() && snap.data().botUsername) {
                setBotLink(\`https://t.me/\${snap.data().botUsername}?start=ref\${user?.uid}\`);
            } else {
                setBotLink(\`https://t.me/placeholder_bot?start=ref\${user?.uid}\`);
            }
        });
    });
    return () => unsub();
  }, [user]);`);
    fs.writeFileSync('src/pages/Refer.tsx', code);
}

function fixDashboard() {
    let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
    // For Dashboard we might have some getDocs etc. We will ignore dashboard ads_config for now as the user primarily asked for VIP + Ads, but let's see.
}

fixDeveloper();
fixSupport();
fixRefer();
