const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// I'll just rewrite handleSave completely.
const start = code.indexOf('const handleSave = async (stayOpen');
const end = code.indexOf('if (editing === "feature_toggles") {', start);
// Wait, I messed up the injection. Let me restore Admin.tsx from Admin_clean.tsx or just fix it carefully.

// Let's replace the corrupted handleSave logic.
const corruptedRegex = /const handleSave = async \(stayOpen: boolean = false\) => \{[\s\S]*?if \(!\["feature_toggles", "ads_rewards_config", "coin_values"\]\.includes\(editing\)\) \{/g;

code = code.replace(corruptedRegex, `const handleSave = async (stayOpen: boolean = false) => {
    if (editing) {
      try {
        if (editing === "bot_setting") {
          await setDoc(doc(db, "settings", "bot_setting"), botSettingData);
        } else if (editing === "developer_profile") {
          await setDoc(doc(db, "settings", "developer_profile"), developerData, { merge: true });
        } else if (editing === "support") {
          await setDoc(doc(db, "settings", "support"), { agents: supportAgents.filter((a: any) => a.name && a.name.trim() !== "") }, { merge: true });
        } else if (editing === "vip_plan") {
          await setDoc(doc(db, "settings", "vip_plans"), { plans: vipPlans.filter((p: any) => (p.title || p.name || "").trim() !== "") }, { merge: true });
        } else if (!["feature_toggles", "ads_rewards_config", "coin_values"].includes(editing)) {`);

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("handleSave repaired.");
