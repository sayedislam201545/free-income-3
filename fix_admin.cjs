const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace('  }, []);\n\nfunction CoinValuesEditor({', '  }, []);\n\n  return <div>Admin Requests</div>;\n}\n\nfunction CoinValuesEditor({');
fs.writeFileSync('src/pages/Admin.tsx', code);
