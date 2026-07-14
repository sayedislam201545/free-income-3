const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /if \(editing === "coin_values"\) \{[\s\S]*?(?=\s*if \(editing === "bot_setting"\))/;
const newCoinValues = `if (editing === "coin_values") {
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
    }`;

content = content.replace(regex, newCoinValues + '\n');
fs.writeFileSync('src/pages/Admin.tsx', content);
