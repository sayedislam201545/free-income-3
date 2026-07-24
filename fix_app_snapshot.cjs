const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Use regex to replace the onSnapshot block with an error handler
code = code.replace(
  /const unsubscribe = onSnapshot\(q, \(snapshot\) => \{([\s\S]*?)new Notification\("New Task Available! 📋", \{\n\s*body: `Earn \$\{taskData\.reward \|\| 0\} VA: \$\{taskData\.title \|\| "Complete this task"\}`,\n\s*icon: "\/favicon\.ico",\n\s*\}\);\n\s*\}\n\s*\}\);\n\s*\}\);/g,
  `const unsubscribe = onSnapshot(q, (snapshot) => {$1new Notification("New Task Available! 📋", {\n            body: \`Earn \$\{taskData.reward || 0\} VA: \$\{taskData.title || "Complete this task"\}\`,\n            icon: "/favicon.ico",\n          });\n        }\n      });\n    }, (error) => {\n      console.warn("App.tsx task listener error", error);\n    });`
);

fs.writeFileSync('src/App.tsx', code);
