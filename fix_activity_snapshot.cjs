const fs = require('fs');
let code = fs.readFileSync('src/pages/Activity.tsx', 'utf8');

code = code.replace(
  /const unsubscribe = onSnapshot\(q, \(snapshot\) => \{([\s\S]*?)setActivities\(acts\);\n\s*\} else \{\n\s*setActivities\(\[\]\);\n\s*\}\n\s*\}\);/g,
  `const unsubscribe = onSnapshot(q, (snapshot) => {$1setActivities(acts);\n      } else {\n        setActivities([]);\n      }\n    }, (error) => {\n      console.warn("Activity.tsx listener error", error);\n    });`
);
fs.writeFileSync('src/pages/Activity.tsx', code);
