const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('GlobalUI')) {
  content = content.replace(
    /import AppLayout from "\.\/components\/layout\/AppLayout";/,
    'import AppLayout from "./components/layout/AppLayout";\nimport GlobalUI from "./components/GlobalUI";'
  );
  
  content = content.replace(
    /<div id="google_translate_element" style=\{\{ display: "none" \}\}\><\/div>/,
    '<div id="google_translate_element" style={{ display: "none" }}></div>\n      <GlobalUI />'
  );
  
  fs.writeFileSync('src/App.tsx', content);
}
