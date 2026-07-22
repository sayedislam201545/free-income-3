const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /useUIStore\.getState\(\)\.addToast\("Failed to save", "error"\);\s*\n\s*\}\s*\n\s*\}\s*\n\s*\};\s*\n\s*if \(editing\) \{/g;
if (code.match(regex)) {
   code = code.replace(regex, `useUIStore.getState().addToast("Failed to save", "error");
      }
    }
  };
  
  if (editing) {`);
} else {
    // maybe try block is missing catch
    const handleSaveStr = `const handleSave = async (stayOpen: boolean = false) => {`;
    console.log("Looking for missing try/catch in handleSave...");
}

// Let's just find `handleSave`
let start = code.indexOf('const handleSave = async (stayOpen');
let str = code.substring(start, start + 3000);
console.log(str.substring(0, 500));
