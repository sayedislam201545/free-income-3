const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_new2.tsx', 'utf8');

// Fix the known unsub issues that were present in Admin_clean.tsx
code = code.replace(/    \}\);\n  \}\n  return \(\) => unsubscribe\(\);\n  \}/g, `    });\n    return () => unsubscribe();\n  }, []);`);
code = code.replace(/    \}\);\n  \}\n  return \(\) => unsub\(\);\n  \}/g, `    });\n    return () => unsub();\n  }, []);`);

fs.writeFileSync('src/pages/Admin.tsx', code);
