const fs = require('fs');
let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');

code = code.replace(
  /const unsubscribe = onSnapshot\(q, \(snapshot\) => \{([\s\S]*?)setTasks\(mergedTasks\);\n\s*\}\n\s*\}\);/g,
  `const unsubscribe = onSnapshot(q, (snapshot) => {$1setTasks(mergedTasks);\n      }\n    }, (error) => {\n      console.warn("Ads listener error", error);\n    });`
);
fs.writeFileSync('src/pages/Ads.tsx', code);
