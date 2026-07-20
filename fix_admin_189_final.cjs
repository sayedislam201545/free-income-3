const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `    });
  }
  return () => {
      unsubUsers();
      unsubSub();
    };
  }, []);`;

const replacement = `    });
    return () => {
      unsubUsers();
      unsubSub();
    };
  }, []);`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Admin.tsx', code);
