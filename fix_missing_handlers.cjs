const fs = require('fs');

function addHandler(filePath, findStr, replaceStr) {
  if (fs.existsSync(filePath)) {
    let code = fs.readFileSync(filePath, 'utf8');
    code = code.replace(findStr, replaceStr);
    fs.writeFileSync(filePath, code);
  }
}

// useFeatureToggles.ts
addHandler('src/hooks/useFeatureToggles.ts',
  `    const unsub = onSnapshot(doc(db, "settings", "feature_toggles"), (snap) => {
      if (snap.exists()) {
        setToggles(prev => ({ ...prev, ...snap.data() }));
      }
    });`,
  `    const unsub = onSnapshot(doc(db, "settings", "feature_toggles"), (snap) => {
      if (snap.exists()) {
        setToggles(prev => ({ ...prev, ...snap.data() }));
      }
    }, (error) => {
      console.error("SNAPSHOT_ERROR: feature_toggles", error);
    });`
);

// Auth.tsx doesn't have onSnapshot.
