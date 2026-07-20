const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const ifEditingStart = code.indexOf('if (editing) {', code.indexOf('const handleSave'));
const mainReturn = code.indexOf('return (', ifEditingStart);

let renderBlock = code.substring(ifEditingStart, mainReturn);

// Remove coin_values inline editor
const cvStart = renderBlock.indexOf('if (editing === "coin_values") {');
const botStart = renderBlock.indexOf('if (editing === "bot_setting") {');
if (cvStart > -1 && botStart > -1) {
    renderBlock = renderBlock.slice(0, cvStart) + renderBlock.slice(botStart);
}

// Remove ads_rewards_config inline editor
const adsStart = renderBlock.indexOf('if (editing === "ads_rewards_config") {');
const nextStart = renderBlock.indexOf('if (editing === "developer_profile") {', adsStart);
if (adsStart > -1 && nextStart > -1) {
    renderBlock = renderBlock.slice(0, adsStart) + renderBlock.slice(nextStart);
}

// Prepend the external editors calls
const externalEditors = `
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

renderBlock = renderBlock.replace('if (editing) {', 'if (editing) {' + externalEditors);

code = code.substring(0, ifEditingStart) + renderBlock + code.substring(mainReturn);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log('Fixed inline editors');

