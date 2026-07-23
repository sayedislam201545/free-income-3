const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/<div id="google_translate_element" style=\{\{ display: "none" \}\}><\/div>/, "");
code = code.replace(/\.goog-te-banner-frame \{[\s\S]*?iframe\.goog-te-banner-frame \{[\s\S]*?\}/, "");
fs.writeFileSync('src/App.tsx', code);
