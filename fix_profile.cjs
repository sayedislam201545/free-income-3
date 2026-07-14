const fs = require('fs');
let content = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

const targetStr = `{
              label: "Developer",
              icon: Code,
              color: "text-gray-700",
              bg: "bg-gradient-to-br from-gray-200 to-gray-300",
              path: "/developer",
            },`;

const newStr = `{
              label: "Developer",
              icon: Code,
              color: "text-gray-700",
              bg: "bg-gradient-to-br from-gray-200 to-gray-300",
              path: "/developer",
            },
            {
              label: "Language",
              icon: Globe,
              color: "text-indigo-600",
              bg: "bg-gradient-to-br from-indigo-100 to-indigo-200",
              path: "/language",
            },`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, newStr);
  if (!content.includes('Globe')) {
    content = content.replace('Code,', 'Code, Globe,');
  }
  fs.writeFileSync('src/pages/Profile.tsx', content);
  console.log("Updated Profile");
}
