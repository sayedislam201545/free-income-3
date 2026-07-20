const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(`    });
  }
  return () => unsub();
  }`, `    });
    return () => unsub();
  }, []);`);

fs.writeFileSync('src/pages/Admin.tsx', code);
