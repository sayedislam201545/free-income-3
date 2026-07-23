const fs = require('fs');
let code = fs.readFileSync('src/pages/Activity.tsx', 'utf8');

const target = `<p className="text-xs text-gray-500 mt-1">{new Date(act.date).toLocaleString()}</p>
                </div>`;

const replacement = `<p className="text-xs text-gray-500 mt-1">{new Date(act.date).toLocaleString()}</p>
                  {act.note && <p className="text-xs text-gray-600 mt-1">{act.note}</p>}
                </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Activity.tsx', code);
