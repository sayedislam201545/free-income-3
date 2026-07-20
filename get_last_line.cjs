const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

let featureToggles = code.indexOf('function FeatureTogglesEditor({ onClose, onSave }: any) {');
if (featureToggles !== -1) {
    let openBraces = 0;
    let foundStart = false;
    let endIndex = -1;
    for (let i = featureToggles; i < code.length; i++) {
        if (code[i] === '{') {
            openBraces++;
            foundStart = true;
        } else if (code[i] === '}') {
            openBraces--;
            if (foundStart && openBraces === 0) {
                endIndex = i;
                break;
            }
        }
    }
    if (endIndex !== -1) {
        let cleanCode = code.substring(0, endIndex + 1) + '\n';
        fs.writeFileSync('src/pages/Admin_clean.tsx', cleanCode);
        console.log("Cleaned file length: " + cleanCode.split('\n').length);
    }
}
