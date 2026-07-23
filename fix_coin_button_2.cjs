const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `<button onClick={handleLocalSave} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>
    </div>
  );
}
function AdsRewardsEditor`;

const replacement = `<button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>
    </div>
  );
}
function AdsRewardsEditor`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/pages/Admin.tsx', code);
  console.log("Replaced exactly!");
} else {
  // Let's just replace all occurrences of the bad line since there's only one other handleLocalSave which is a function definition.
  const oldLine = '<button onClick={handleLocalSave} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>';
  const newLine = '<button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:bg-blue-700">Save Changes</button>';
  let count = 0;
  code = code.split('\\n').map(line => {
      if (line.includes(oldLine)) {
         count++;
         // If it's the first occurrence (in CoinValuesEditor), replace it.
         // If it's the second occurrence (in AdsRewardsEditor), KEEP it!
         if (count === 1) {
             return line.replace(oldLine, newLine);
         }
      }
      return line;
  }).join('\\n');
  fs.writeFileSync('src/pages/Admin.tsx', code);
  console.log("Replaced via mapping, count = " + count);
}

