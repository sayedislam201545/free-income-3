const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const badIndex = code.indexOf('} from "react";');
console.log("badIndex is:", badIndex);
if (badIndex !== -1) {
    const chunk = code.substring(badIndex - 10, badIndex + 30);
    console.log("Chunk:", JSON.stringify(chunk));
}
