const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target = `            if (config.monetagScriptUrl && config.monetagZoneId && config.monetagSdk) {
                const { triggerMonetagAd } = await import("../lib/monetag");
                triggerMonetagAd(config.monetagScriptUrl, config.monetagZoneId, config.monetagSdk);
            }`;

const replacement = `            const { handleAdTrigger } = await import("../lib/monetag");
            handleAdTrigger(config);`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Dashboard.tsx', code);
    console.log("Dashboard updated successfully!");
} else {
    console.log("Target not found in Dashboard.tsx!");
}
