const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(
  /}\s*const \[requests, setRequests\] = useState<any\[\]>\(\[\]\);/,
  `}\n\nfunction AdminRequests() {\n  const [requests, setRequests] = useState<any[]>([]);`
);

fs.writeFileSync('src/pages/Admin.tsx', code);
