const fs = require('fs');

function getCode(filename, varName) {
    const src = fs.readFileSync(filename, 'utf8');
    const startStr = `const ${varName} = \``;
    const startStr2 = `let ${varName} = \``;
    
    let startIdx = src.indexOf(startStr);
    if (startIdx === -1) {
        startIdx = src.indexOf(startStr2);
        if (startIdx === -1) {
             console.log("NOT FOUND: " + varName);
             return "";
        }
        startIdx += startStr2.length;
    } else {
        startIdx += startStr.length;
    }
    
    // Find matching backtick that is NOT escaped
    let idx = startIdx;
    while (idx < src.length) {
        if (src[idx] === '\`' && src[idx-1] !== '\\') {
            break;
        }
        idx++;
    }
    
    let val = src.substring(startIdx, idx);
    // Unescape things
    val = val.replace(/\\\`/g, '\`').replace(/\\\$/g, '$');
    return val;
}

let dash = getCode('fix_admin_dash_2.cjs', 'dashContent');
let sub = getCode('fix_submissions.cjs', 'newCode');
let set = getCode('fix_admin_settings_now.cjs', 'adminSettingsCode');
let vip = getCode('fix_admin_vip.cjs', 'newCode');

fs.writeFileSync('extracted_safe.json', JSON.stringify([dash, sub, set, vip]));
console.log("DONE");
