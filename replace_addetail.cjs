const fs = require('fs');
let code = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

const target = `    if (adsConfig.monetagScriptUrl && adsConfig.monetagZoneId && adsConfig.monetagSdk) {
        import("../lib/monetag").then(({ triggerMonetagAd }) => {
            triggerMonetagAd(adsConfig.monetagScriptUrl, adsConfig.monetagZoneId, adsConfig.monetagSdk);
        });
    } else if (adsConfig.monetagSdk && window[adsConfig.monetagSdk as any]) {
        (window as any)[adsConfig.monetagSdk]();
    } else if (adsConfig.monetagZoneId) {
        const url = adsConfig.monetagZoneId.startsWith("http") ? adsConfig.monetagZoneId : \`//\${adsConfig.monetagZoneId}\`;
        if ((window as any).Telegram?.WebApp) {
          (window as any).Telegram.WebApp.openLink(url);
        } else {
          window.open(url, "_blank");
        }
    }`;

const replacement = `    import("../lib/monetag").then(({ handleAdTrigger }) => {
        handleAdTrigger(adsConfig);
    });`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/AdDetail.tsx', code);
    console.log("AdDetail updated successfully!");
} else {
    console.log("Target not found in AdDetail.tsx!");
}
