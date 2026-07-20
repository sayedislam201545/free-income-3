const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const handleSaveStart = code.indexOf('const handleSave = async (stayOpen: boolean = false) => {');
const ifEditingStart = code.indexOf('if (editing) {', handleSaveStart);
const handleSaveEnd = code.indexOf('  if (editing) {', ifEditingStart + 10); // Find the if(editing) render block

if (handleSaveStart > -1 && handleSaveEnd > -1) {
    let newHandleSave = `const handleSave = async (stayOpen: boolean = false) => {
    if (editing) {
      try {
        if (editing === "bot_setting") {
          await setDoc(doc(db, "settings", "bot_setting"), botSettingData);
        } else if (editing === "developer_profile") {
          await setDoc(doc(db, "settings", "developer_profile"), developerData, { merge: true });
        } else if (editing === "support") {
          await setDoc(doc(db, "settings", "support"), { agents: supportAgents.filter(a => a.name.trim() !== "") }, { merge: true });
        } else if (editing === "vip_plan") {
          await setDoc(doc(db, "settings", "vip_plans"), { plans: vipPlans.filter(p => (p.title || p.name || "").trim() !== "") }, { merge: true });
        } else {
          await setDoc(doc(db, "settings", editing), { content: editContent }, { merge: true });
        }
        
        useUIStore.getState().addToast("Saved!");
        if (!stayOpen) setEditing(null);
      } catch (err) {
        useUIStore.getState().addToast("Failed to save", "error");
      }
    }
  };
`;
    code = code.substring(0, handleSaveStart) + newHandleSave + code.substring(handleSaveEnd);
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("handleSave fixed!");
}
