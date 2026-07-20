const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_backup.tsx', 'utf8');

code = code.replace(/    \}\);\n  \}\n  return \(\) => unsubscribe\(\);\n  \}, \[\]\);/g, 
`    });
    return () => unsubscribe();
  }, []);`);

code = code.replace(/    \}\);\n  \}\n  return \(\) => unsub\(\);\n  \}, \[\]\);/g, 
`    });
    return () => unsub();
  }, []);`);

fs.writeFileSync('src/pages/Admin_backup.tsx', code);
