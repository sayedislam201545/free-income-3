const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const handleSaveStr = `  const handleSave = async (stayOpen: boolean = false) => {
    if (editing) {
      try {
        if (editing === "bot_setting") {
          await setDoc(doc(db, "settings", "bot_setting"), botSettingData);
        } else if (editing === "developer_profile") {
          await setDoc(doc(db, "settings", "developer_profile"), developerData, { merge: true });
        } else if (editing === "support") {
          await setDoc(doc(db, "settings", "support"), { agents: supportAgents.filter((a: any) => a.name.trim() !== "") }, { merge: true });
        } else if (editing === "vip_plan") {
          await setDoc(doc(db, "settings", "vip_plans"), { plans: vipPlans.filter((p: any) => (p.title || p.name || "").trim() !== "") }, { merge: true });
        } else if (editing !== "feature_toggles" && editing !== "ads_rewards_config" && editing !== "coin_values") {
          await setDoc(doc(db, "settings", editing), { content: editContent }, { merge: true });
        }
        
        useUIStore.getState().addToast("Saved!");
        if (!stayOpen) setEditing(null);
      } catch (err) {
        useUIStore.getState().addToast("Failed to save", "error");
      }
    }
  };`;

// Find handleSave and replace it completely until the start of if (editing) {
const hsStart = code.indexOf('const handleSave = async (stayOpen: boolean = false) => {');
const ifEditingRenderStart = code.indexOf('  if (editing) {', hsStart + 200);

if (hsStart > -1 && ifEditingRenderStart > -1) {
    code = code.substring(0, hsStart) + handleSaveStr + '\n\n' + code.substring(ifEditingRenderStart);
    fs.writeFileSync('src/pages/Admin.tsx', code);
    console.log("Replaced handleSave");
}

code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Now, let's fix the broken bot_setting being inside handleSave ? Wait, we just overwrote handleSave, so the broken bot_setting inside handleSave is GONE!
// BUT the original render block still has the bot_setting UI! Let's check!
