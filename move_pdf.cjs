const fs = require('fs');

let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const pdfFuncMatch = content.match(/const generateAdminPDF = async \(\) => \{[\s\S]*?alert\("Failed to generate PDF\. Check console for details\."\);\s*\}\s*\};/);

if (pdfFuncMatch) {
  const pdfFunc = pdfFuncMatch[0];
  content = content.replace(pdfFunc, '');
  content = content.replace(/\{ name: "Activity Summary \(PDF\)"[\s\S]*?\},/, '');
  
  content = content.replace(
    /function AdminSettings\(\) \{/,
    `function AdminSettings() {\n  ${pdfFunc}\n`
  );

  content = content.replace(
    /\{\s*label: "Bot Settings",\s*key: "bot_setting",\s*desc: "Configure telegram bot keys",\s*icon: "🤖",\s*\},/,
    `{
            label: "Bot Settings",
            key: "bot_setting",
            desc: "Configure telegram bot keys",
            icon: "🤖",
          },
          {
            label: "Activity Summary (PDF)",
            key: "activity_summary",
            desc: "Download activity summary PDF",
            icon: "📄",
            onClick: generateAdminPDF
          },`
  );
  
  // also add onClick support in the mapping
  content = content.replace(
    /<button\s*key=\{item\.key\}\s*onClick=\{\(\) => handleEdit\(item\.key\)\}/,
    `<button
            key={item.key}
            onClick={() => {
              if ((item as any).onClick) {
                (item as any).onClick();
              } else {
                handleEdit(item.key);
              }
            }}`
  );

  fs.writeFileSync('src/pages/Admin.tsx', content);
  console.log("Moved PDF to settings");
} else {
  console.log("Could not find PDF func");
}
