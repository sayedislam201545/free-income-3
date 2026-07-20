const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(`    });
  }
  return () => unsubscribe();
  }`, `    });
    return () => unsubscribe();
  }, []);`);

code = code.replace(`function CoinValuesEditor({ onClose, onSave, initialValues }function AdsRewardsEditor`, `function CoinValuesEditor({ onClose, onSave, initialValues }: any) {
  // It looks like CoinValuesEditor was truncated. Let's just restore them properly!
`);

fs.writeFileSync('src/pages/Admin.tsx', code);
