const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

if (!code.includes('if (editing === "feature_toggles") {')) {
  const target = `if (editing === "developer_profile") {`;
  const injection = `if (editing === "feature_toggles") {
      return <FeatureTogglesEditor onClose={() => setEditing(null)} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "feature_toggles"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Toggles");
        setEditing(null);
      }} />;
    }
    if (editing === "ads_rewards_config") {
      return <AdsRewardsEditor onClose={() => setEditing(null)} initialAdsConfig={adsConfig} initialRewardsConfig={rewardsConfig} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "ads_rewards_config"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Config");
        setEditing(null);
      }} />;
    }
    if (editing === "coin_values") {
      return <CoinValuesEditor onClose={() => setEditing(null)} onSave={async (vals: any) => {
        await setDoc(doc(db, "settings", "coin_values"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Coin Values");
        setEditing(null);
      }} />;
    }\n\n    `;
  
  code = code.replace(target, injection + target);
}

fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Missing config editors injected");
