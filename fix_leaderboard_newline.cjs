const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\nimport/g, '\nimport');
  fs.writeFileSync(file, code);
}

fix('src/pages/Leaderboard.tsx');
