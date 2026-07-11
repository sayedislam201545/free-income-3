const fs = require('fs');
let code = fs.readFileSync('src/pages/ReferralsLog.tsx', 'utf8');

const target = `        {loading ? (
          <div className="flex justify-center items-center py-20 text-purple-600 font-bold text-sm">
            Loading logs...
          </div>
        ) : logs.length === 0 ? (`;

const replacement = `        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/ReferralsLog.tsx', code);
