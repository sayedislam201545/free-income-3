const fs = require('fs');
let code = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');

code = code.replace(/let baseReward = 30;\n          try \{\n             const configSnap = await getDoc\(doc\(db, "settings", "ads_rewards_config"\)\);/, 
`let baseReward = 30;
          try {
             const { doc, getDoc } = await import("firebase/firestore");
             const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));`);

fs.writeFileSync('src/pages/CheckIn.tsx', code);
