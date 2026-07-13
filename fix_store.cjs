const fs = require('fs');
let code = fs.readFileSync('src/store/useAuthStore.ts', 'utf8');
code = code.replace("  watchedAds?: number;", "  watchedAds?: number;\n  adCampaignsWatched?: Record<string, { dailyWatched: number, lastDate: string }>;");
fs.writeFileSync('src/store/useAuthStore.ts', code);
