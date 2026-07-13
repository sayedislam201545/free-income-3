const fs = require('fs');
let code = fs.readFileSync('tsconfig.json', 'utf8');
const data = JSON.parse(code);
if (!data.exclude) {
    data.exclude = ["dist", "node_modules"];
} else if (Array.isArray(data.exclude)) {
    if (!data.exclude.includes("dist")) data.exclude.push("dist");
    if (!data.exclude.includes("node_modules")) data.exclude.push("node_modules");
}
fs.writeFileSync('tsconfig.json', JSON.stringify(data, null, 2));
