const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/function AdminUsers\(\) \{/, 'return <div className="text-white p-6">Admin Submissions Page (Pending restoration)</div>;\n}\n\nfunction AdminUsers() {');
code = code.replace(/function AdminAchievements\(\) \{/, 'return <div className="text-white p-6">Admin Users Page (Pending restoration)</div>;\n}\n\nfunction AdminAchievements() {');
code = code.replace(/function AdminPayments\(\) \{/, 'return <div className="text-white p-6">Admin Achievements Page (Pending restoration)</div>;\n}\n\nfunction AdminPayments() {');

fs.writeFileSync('src/pages/Admin.tsx', code);
