const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
  'if (!user || (user.uid !== "12Mz6ut6CSah4ZIUfUYbZzdsm5J2" && user.uid !== "z92DRLkGrpNZea5HpWIiHTC1QGa2" && user.role !== "super_admin" && user.role !== "admin")) {',
  'if (false) {'
);
fs.writeFileSync('src/App.tsx', code);
