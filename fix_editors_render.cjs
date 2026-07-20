const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const ifEditingStart = code.indexOf('if (editing) {', code.indexOf('const handleSave'));
const theEnd = code.indexOf('return (', ifEditingStart); // The main return of AdminSettings

if (ifEditingStart > -1 && theEnd > -1) {
    let renderBlock = `
  if (editing) {
    if (editing === "feature_toggles") {
      return <FeatureTogglesEditor onClose={() => setEditing(null)} onSave={async (vals) => {
        await setDoc(doc(db, "settings", "feature_toggles"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Toggles");
        setEditing(null);
      }} />;
    }
    if (editing === "ads_rewards_config") {
      return (
        <AdsRewardsEditor
          onClose={() => setEditing(null)}
          onSave={async (adsConfig, rewardsConfig, adsBoxes) => {
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
          onSave={async (values) => {
            await setDoc(doc(db, "settings", "coin_values"), values, { merge: true });
            useUIStore.getState().addToast("Saved!");
            setEditing(null);
          }}
          initialValues={coinValues}
        />
      );
    }

`;
    // Then there's the rest of the inline editors (bot_setting, etc).
    // I will extract them from the old render block.
}
