const fs = require('fs');
let code = fs.readFileSync('src/pages/Task.tsx', 'utf8');

const regex = /const CATEGORIES = \[\s*\{ id: "joined", label: "Joined Tasks" \},\s*\{ id: "visit", label: "Visit Tasks" \},\s*\{ id: "registration", label: "App registration" \},\s*\{ id: "vip", label: "VIP User Task" \},\s*\];/;

const newCode = `const CATEGORIES = [
  { id: "joined", label: "Joined Tasks" },
  { id: "visit", label: "Visit Tasks" },
  { id: "registration", label: "App registration" },
];`;

code = code.replace(regex, newCode);
fs.writeFileSync('src/pages/Task.tsx', code);
