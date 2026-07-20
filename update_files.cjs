const fs = require('fs');
const path = require('path');

// 1. Update index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');
if (!indexHtml.includes('google_translate_element')) {
    indexHtml = indexHtml.replace('</head>', `    <div id="google_translate_element" style="display:none;"></div>
    <script type="text/javascript">
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({pageLanguage: 'en', autoDisplay: false}, 'google_translate_element');
      }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
  </head>`);
    fs.writeFileSync('index.html', indexHtml);
    console.log('Updated index.html');
}

// 2. Update Profile.tsx
let profileTsx = fs.readFileSync('src/pages/Profile.tsx', 'utf8');
if (!profileTsx.includes('Leagues')) {
    // Add Leagues button next to Developer
    const devBtnIndex = profileTsx.indexOf('<SettingsItem icon={<Code2 className="w-5 h-5" />} label="Developer" onClick={() => navigate("/developer")} />');
    if (devBtnIndex !== -1) {
        profileTsx = profileTsx.slice(0, devBtnIndex) + 
            `<SettingsItem icon={<Globe className="w-5 h-5" />} label="Leagues" onClick={() => navigate("/language")} />\n              ` +
            profileTsx.slice(devBtnIndex);
        fs.writeFileSync('src/pages/Profile.tsx', profileTsx);
        console.log('Updated Profile.tsx');
    }
}

// 3. Update Language.tsx
let languageTsx = fs.readFileSync('src/pages/Language.tsx', 'utf8');
if (languageTsx.includes('Language Settings')) {
    languageTsx = languageTsx.replace('Language Settings', 'Leagues');
    // Also add window.location.reload();
    languageTsx = languageTsx.replace("select.dispatchEvent(new Event('change', { bubbles: true }));", "select.dispatchEvent(new Event('change', { bubbles: true }));\n      setTimeout(() => window.location.reload(), 300);");
    fs.writeFileSync('src/pages/Language.tsx', languageTsx);
    console.log('Updated Language.tsx');
}

