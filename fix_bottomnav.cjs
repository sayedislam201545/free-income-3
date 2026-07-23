const fs = require('fs');
let code = fs.readFileSync('src/components/layout/BottomNav.tsx', 'utf8');

if (!code.includes('useTranslation')) {
    code = code.replace('import { cn } from "../../lib/utils";', 'import { cn } from "../../lib/utils";\nimport { useTranslation } from "react-i18next";');
    code = code.replace('export default function BottomNav() {', 'export default function BottomNav() {\n  const { t } = useTranslation();');
    
    code = code.replace('{ to: "/task", icon: ClipboardList, label: "Task" }', '{ to: "/task", icon: ClipboardList, label: t("Tasks") }');
    code = code.replace('{ to: "/ads", icon: MonitorPlay, label: "Ads" }', '{ to: "/ads", icon: MonitorPlay, label: t("Ads") }');
    code = code.replace('{ to: "/", icon: Home, label: "Home" }', '{ to: "/", icon: Home, label: t("Home") }');
    code = code.replace('{ to: "/leaderboard", icon: Trophy, label: "Leaderboard" }', '{ to: "/leaderboard", icon: Trophy, label: t("Leaderboard") }');
    code = code.replace('{ to: "/profile", icon: User, label: "Profile" }', '{ to: "/profile", icon: User, label: t("Profile") }');
    
    fs.writeFileSync('src/components/layout/BottomNav.tsx', code);
}
