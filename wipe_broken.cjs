const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// The block to wipe starts at "if (editing) {" which is after "const handleSave = async (stayOpen: boolean = false) => {"
// and ends where the real "if (editing === "feature_toggles") {" starts. 
// Wait, I already removed the external editors in my previous regex? No, I overwrote handleSave, but maybe not the external editors.

let hsStart = code.indexOf('const handleSave = async (stayOpen: boolean = false) => {');
let endHs = code.indexOf('};', hsStart);

let nextIfEditing = code.indexOf('if (editing) {', endHs);
let brokenEnd = code.indexOf('catch (err) {', nextIfEditing);
let endBrokenEnd = code.indexOf('}', brokenEnd) + 1; // closing brace of catch

let newRenderBlock = `
  if (editing) {
    if (editing === "feature_toggles") {
      return <FeatureTogglesEditor onClose={() => setEditing(null)} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "feature_toggles"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Toggles!");
        setEditing(null);
      }} />;
    }
    if (editing === "ads_rewards_config") {
      return (
        <AdsRewardsEditor
          onClose={() => setEditing(null)}
          onSave={async (adsConfig: any, rewardsConfig: any, adsBoxes: any) => {
            try {
              await setDoc(doc(db, "settings", "ads_config"), adsConfig, { merge: true });
              await setDoc(doc(db, "settings", "rewards_config"), rewardsConfig, { merge: true });
              await setDoc(doc(db, "settings", "ads_boxes"), { boxes: adsBoxes }, { merge: true });
              useUIStore.getState().addToast("Saved Settings!");
              setEditing(null);
            } catch (e) {
              useUIStore.getState().addToast("Failed to save", "error");
            }
          }}
          initialAdsConfig={adsConfig}
          initialRewardsConfig={rewardsConfig}
        />
      );
    }
    if (editing === "coin_values") {
      return (
        <CoinValuesEditor
          onClose={() => setEditing(null)}
          onSave={async (values: any) => {
            await setDoc(doc(db, "settings", "coin_values"), values, { merge: true });
            useUIStore.getState().addToast("Saved!");
            setEditing(null);
          }}
          initialValues={coinValues}
        />
      );
    }
`;

// But what about the UI for bot_settings, developer_profile, support, vip_plan?
// They are supposed to be below the coin_values return block.
// I will get them from admin_settings.txt directly.

let oldAdmin = fs.readFileSync('admin_settings.txt', 'utf8');
let botStart = oldAdmin.lastIndexOf('if (editing === "bot_setting") {');
// The main return ( of AdminSettings is at the end.
let mainReturnStart = oldAdmin.lastIndexOf('return (');

let restOfUI = oldAdmin.substring(botStart, mainReturnStart);

// So we just replace from nextIfEditing to the main return with newRenderBlock + restOfUI.
let adminReturn = code.indexOf('return (', nextIfEditing);

code = code.substring(0, nextIfEditing) + newRenderBlock + "    " + restOfUI + code.substring(adminReturn);

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Fixed rendering block completely!");
