const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// replace "  );}" with "  );\n}\n}\n}\n}" before function FeatureTogglesEditor
code = code.replace(/  \);\n\}function FeatureTogglesEditor/, `  );\n}\n}\n}\n}\n\nfunction FeatureTogglesEditor`);

fs.writeFileSync('src/pages/Admin.tsx', code);
