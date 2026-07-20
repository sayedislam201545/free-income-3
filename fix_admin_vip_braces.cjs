const fs = require('fs');
let data = JSON.parse(fs.readFileSync('extracted_safe.json', 'utf8'));
let vip = data[3];
vip = vip.replace('function AdminDashboard() {', '');
data[3] = vip;
fs.writeFileSync('extracted_safe.json', JSON.stringify(data));
