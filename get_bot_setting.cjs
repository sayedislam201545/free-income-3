const fs = require('fs');
let code = fs.readFileSync('admin_settings.txt', 'utf8');

// I will extract the UIs from admin_settings.txt line 299 to the end of if(editing).
const botStart = code.indexOf('if (editing === "bot_setting") {', 5000); // just to skip the first one
console.log("botStart: " + botStart);
