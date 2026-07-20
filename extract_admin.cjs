const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Insert routes
const routesOld = `
            <Route path="users" element={<AdminUsers />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="payments" element={<AdminPayments />} />
`;
const routesNew = `
            <Route path="users" element={<AdminUsers />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="requests" element={<AdminRequests />} />
            <Route path="vip" element={<AdminVIP />} />
            <Route path="developer" element={<AdminDeveloper />} />
`;
code = code.replace(routesOld, routesNew);
fs.writeFileSync('src/pages/Admin.tsx', code);
