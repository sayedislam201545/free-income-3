const fs = require('fs');

let profileTsx = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
if (!profileTsx.includes('label: "Leagues"')) {
    const devBtnIndex = profileTsx.indexOf('label: "Developer",');
    if (devBtnIndex !== -1) {
        // find the start of the developer object `{`
        const objectStart = profileTsx.lastIndexOf('{', devBtnIndex);
        profileTsx = profileTsx.slice(0, objectStart) + 
            `{\n              label: "Leagues",\n              icon: Globe,\n              color: "text-blue-600",\n              bg: "bg-gradient-to-br from-blue-100 to-blue-200",\n              path: "/language",\n            },\n            ` +
            profileTsx.slice(objectStart);
        
        // ensure Globe is imported
        if (!profileTsx.includes('Globe')) {
            profileTsx = profileTsx.replace('import {', 'import { Globe, ');
        }
        
        fs.writeFileSync('src/pages/Profile.tsx', profileTsx);
        console.log('Updated Profile.tsx');
    }
}
