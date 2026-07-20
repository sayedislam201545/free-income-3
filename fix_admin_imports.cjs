const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(
  /} from "firebase\/firestore";/,
  `  query,
  where,
  increment,
  orderBy,
  limit,
} from "firebase/firestore";`
);

fs.writeFileSync('src/pages/Admin.tsx', code);
