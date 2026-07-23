const fs = require('fs');

let code = fs.readFileSync('src/pages/Language.tsx', 'utf8');
code = code.replace("import { useLanguageStore } from \"../store/useLanguageStore\";", 
`import { useLanguageStore } from "../store/useLanguageStore";
import { useTranslation } from "react-i18next";`);

const handleSelect = `  const handleSelectLanguage = (langCode: string, langName: string) => {
    setLanguage(langName);
    
    // Set cookies for persistence across reloads
    document.cookie = \`googtrans=/en/\${langCode}; path=/;\`;
    if (window.location.hostname !== 'localhost') {
        document.cookie = \`googtrans=/en/\${langCode}; path=/; domain=\${window.location.hostname};\`;
    }

    // Attempt to change language via the embedded script combo box
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      setTimeout(() => window.location.reload(), 300);
    }
  };`;

const newHandleSelect = `  const { i18n } = useTranslation();
  const handleSelectLanguage = (langCode: string, langName: string) => {
    setLanguage(langName);
    i18n.changeLanguage(langCode);
    localStorage.setItem('app_language', langCode);
  };`;

code = code.replace(handleSelect, newHandleSelect);
fs.writeFileSync('src/pages/Language.tsx', code);
