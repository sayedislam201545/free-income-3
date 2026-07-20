const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin_backup.tsx', 'utf8');
code = code.replace(
`    });
  }
  return () => unsub();
  }, []);`,
`    });
    return () => unsub();
  }, []);`
);
fs.writeFileSync('src/pages/Admin_backup.tsx', code);
