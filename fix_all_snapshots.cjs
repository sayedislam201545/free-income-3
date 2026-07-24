const fs = require('fs');
const files = [
  'src/App.tsx',
  'src/pages/Activity.tsx',
  'src/pages/Task.tsx',
  'src/pages/Leaderboard.tsx',
  'src/pages/ReferralsLog.tsx',
  'src/pages/Ads.tsx',
  'src/store/useAuthStore.ts',
  'src/hooks/useFeatureToggles.ts',
  'src/pages/Developer.tsx',
  'src/pages/VIP.tsx',
  'src/pages/Support.tsx',
  'src/pages/CheckIn.tsx',
  'src/pages/Earn.tsx',
  'src/pages/Achievements.tsx',
  'src/pages/Wallet.tsx',
  'src/pages/AdDetail.tsx',
  'src/pages/Refer.tsx',
  'src/pages/Admin.tsx',
  'src/pages/PageViewer.tsx'
];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  
  // Add a generic toast import if it doesn't exist
  if (!code.includes("react-hot-toast")) {
    // If it's a tsx file, we might inject it
  }

  // Replace all generic error handlers
  code = code.replace(/console\.warn\("(.*?)", error\);/g, 'console.error("SNAPSHOT_ERROR: $1", error);');
  
  fs.writeFileSync(file, code);
}
