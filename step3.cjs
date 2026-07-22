const fs = require('fs');
let db = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
const regex = /<div className="flex justify-between items-center space-x-3 mb-6">[\s\S]*?<button[\s\S]*?Tasks<\/span>[\s\S]*?<\/button>[\s\S]*?<button[\s\S]*?Ads<\/span>[\s\S]*?<\/button>\s*<\/div>/;
if(regex.test(db)) {
    db = db.replace(regex, '');
    fs.writeFileSync('src/pages/Dashboard.tsx', db);
    console.log("Removed from Dashboard");
} else {
    console.log("Could not find regex in Dashboard");
}

let prof = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
if (!prof.includes('path: "/task"')) {
    const target = '{              label: "Daily Check-in",';
    const injection = `{              label: "Tasks",              icon: FileText,              color: "text-blue-600",              bg: "bg-gradient-to-br from-blue-100 to-blue-200",              path: "/task",            },            {              label: "Ads",              icon: Activity,              color: "text-red-600",              bg: "bg-gradient-to-br from-red-100 to-red-200",              path: "/ads",            },            {              label: "Daily Check-in",`;
    prof = prof.replace(target, injection);
    fs.writeFileSync('src/pages/Profile.tsx', prof);
    console.log("Added to Profile");
}
