const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/unsubs\.push\(m\.onSnapshot\(m\.doc\(db, "settings", "vip_plans"\), \(snap\) => \{\s*if \(snap\.exists\(\) && snap\.data\(\)\.plans\) setVipPlans\(snap\.data\(\)\.plans\);\s*\}\)\);/, '');
code = code.replace(/const \[vipPlans, setVipPlans\] = useState<any\[\]>\(\[\]\);/, '');
code = code.replace(/\} else if \(editing === "vip_plan"\) \{\s*await setDoc\(doc\(db, "settings", "vip_plans"\), \{ plans: vipPlans\.filter\(\(p: any\) => \(p\.title \|\| p\.name \|\| ""\)\.trim\(\) !== ""\) \}, \{ merge: true \}\);/, '');

fs.writeFileSync('src/pages/Admin.tsx', code);
