const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const oldSidebar = `
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
            { name: "Tasks", icon: ListTodo, path: "/admin/tasks" },
            { name: "Submissions", icon: CheckCircle, path: "/admin/submissions" },
            { name: "Achievements", icon: Trophy, path: "/admin/achievements" },
            { name: "Users & VIP", icon: Users, path: "/admin/users" },
            { name: "Resources", icon: Upload, path: "/admin/payments" },
            { name: "Settings", icon: Settings, path: "/admin/settings" },
            
            { name: "Exit Admin", icon: X, path: "/", textClass: "text-red-400" },
          ]`;

const newSidebar = `
          {[
            { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
            { name: "Tasks", icon: ListTodo, path: "/admin/tasks" },
            { name: "Submissions", icon: CheckCircle, path: "/admin/submissions" },
            { name: "Achievements", icon: Trophy, path: "/admin/achievements" },
            { name: "Users page", icon: Users, path: "/admin/users" },
            { name: "Payments", icon: Upload, path: "/admin/payments" },
            { name: "Requests", icon: Bell, path: "/admin/requests" },
            { name: "VIP Plans", icon: Trophy, path: "/admin/vip" },
            { name: "Developer Profile", icon: User, path: "/admin/developer" },
            { name: "Settings", icon: Settings, path: "/admin/settings" },
            { name: "Exit Admin", icon: X, path: "/", textClass: "text-red-400" },
          ]`;

code = code.replace(oldSidebar, newSidebar);
fs.writeFileSync('src/pages/Admin.tsx', code);
