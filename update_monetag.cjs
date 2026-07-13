const fs = require('fs');
let code = `export const handleAdTrigger = (adsConfig: any) => {
    const scriptUrl = "https://libtl.com/sdk.js";
    const zoneId = "9955574";
    const sdk = "show_9955574";

    let script = document.querySelector(\`script[data-zone="\${zoneId}"]\`);
    
    if (!script) {
        script = document.createElement("script");
        script.src = scriptUrl;
        script.setAttribute("data-zone", zoneId);
        script.setAttribute("data-sdk", sdk);
        script.async = true;
        document.head.appendChild(script);
    }
    
    // Call it
    if ((window as any)[sdk]) {
        try {
            (window as any)[sdk]();
            return true;
        } catch(e) { 
            console.error(e);
        }
    } else {
        // wait for it to load
        const maxWait = 5000;
        const start = Date.now();
        const check = setInterval(() => {
            if ((window as any)[sdk]) {
                clearInterval(check);
                try {
                    (window as any)[sdk]();
                } catch(e) {
                    console.error("Ad error", e);
                }
            } else if (Date.now() - start > maxWait) {
                clearInterval(check);
            }
        }, 200);
    }
    return true;
};`;
fs.writeFileSync('src/lib/monetag.ts', code);
console.log("Monetag script updated");
