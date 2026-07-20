const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
code = code.replace('export default function AdminLayout() {\n  const [sidebarOpen, setSidebarOpen] = useState(false);', 'export default function AdminLayout() {\n  const [sidebarOpen, setSidebarOpen] = useState(false);\n  console.log("AdminLayout rendering");');
code = code.replace('function AdminDashboard() {\n  const [stats, setStats] = useState({', 'function AdminDashboard() {\n  console.log("AdminDashboard rendering");\n  const [stats, setStats] = useState({');
fs.writeFileSync('src/pages/Admin.tsx', code);
