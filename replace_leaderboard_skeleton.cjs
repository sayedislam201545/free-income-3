const fs = require('fs');
let code = fs.readFileSync('src/pages/Leaderboard.tsx', 'utf8');

const target1 = `  const [searchTerm, setSearchTerm] = useState('');`;
const replacement1 = `  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);`;
code = code.replace(target1, replacement1);

const target2 = `             setListUsers(formattedUsers);
         } else {
             setListUsers([]);
         }`;
const replacement2 = `             setListUsers(formattedUsers);
         } else {
             setListUsers([]);
         }
         setIsLoading(false);`;
code = code.replace(target2, replacement2);

const target3 = `      {/* Leaderboard List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => {`;
const replacement3 = `      {/* Leaderboard List */}
      <div className="space-y-3">
        {isLoading && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[20px] p-3 flex items-center border border-gray-100 shadow-sm animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0 mx-3"></div>
            <div className="flex-1 min-w-0">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/3"></div>
            </div>
            <div className="w-12 h-6 bg-gray-200 rounded shrink-0"></div>
          </div>
        ))}
        {!isLoading && filteredUsers.map((user) => {`;
code = code.replace(target3, replacement3);

const target4 = `        {filteredUsers.length === 0 && (`;
const replacement4 = `        {!isLoading && filteredUsers.length === 0 && (`;
code = code.replace(target4, replacement4);

fs.writeFileSync('src/pages/Leaderboard.tsx', code);
