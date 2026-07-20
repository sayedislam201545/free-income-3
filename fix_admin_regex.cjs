const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// I will look for:
//     });
//   }
//   return () => {
//       unsubUsers();
//       unsubSub();
//     };
//   }, []);
// And replace the "  }\n  return" with "    return"

code = code.replace(/    \}\);\n  \}\n  return \(\) \=\> \{/g, '    });\n    return () => {');
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Regex replaced");
