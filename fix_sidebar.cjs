const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /\{\s*name:\s*"Dashboard"[\s\S]*?\{\s*name:\s*"Users & VIP"/;
if (regex.test(code)) {
    code = code.replace(regex, '{ name: "Dashboard", icon: LayoutDashboard, path: "/admin" },\n            { name: "Tasks", icon: ListTodo, path: "/admin/tasks" },\n            { name: "Submissions", icon: CheckCircle, path: "/admin/submissions" },\n            { name: "Achievements", icon: Trophy, path: "/admin/achievements" },\n            { name: "Users & VIP"');
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Fixed sidebar links.");
} else {
    console.log("Regex didn't match.");
}
