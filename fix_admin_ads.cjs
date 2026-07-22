const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Fix setAdsRewardsData locally when saving
const oldSave = `await setDoc(doc(db, "settings", "ads_rewards_config"), vals, { merge: true });
        useUIStore.getState().addToast("Saved Config");
        setEditing(null);`;
const newSave = `await setDoc(doc(db, "settings", "ads_rewards_config"), vals, { merge: true });
        setAdsRewardsData(vals);
        useUIStore.getState().addToast("Saved Config");
        setEditing(null);`;

code = code.replace(oldSave, newSave);

const oldAdsRewardsEditor = `function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>(initialValues || { normal: {}, vip: {}, settings: {} });`;

const newAdsRewardsEditor = `function AdsRewardsEditor({ onClose, onSave, initialValues }: any) {
  const [values, setValues] = useState<any>({ 
    normal: initialValues?.normal || {}, 
    vip: initialValues?.vip || {}, 
    settings: initialValues?.settings || {} 
  });`;

code = code.replace(oldAdsRewardsEditor, newAdsRewardsEditor);

fs.writeFileSync('src/pages/Admin.tsx', code);
