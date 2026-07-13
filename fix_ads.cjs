const fs = require('fs');
let code = fs.readFileSync('src/pages/Ads.tsx', 'utf8');

const replacement = `        {tasks.map((task, idx) => {
          const emoji = AD_EMOJIS[idx % AD_EMOJIS.length];
          const campaignId = task.fbId || task.id;
          let watchedCount = 0;
          const limit = 50;
          if (user && user.adCampaignsWatched && user.adCampaignsWatched[campaignId]) {
             const data = user.adCampaignsWatched[campaignId];
             if (data.lastDate === new Date().toDateString()) {
                 watchedCount = data.dailyWatched || 0;
             }
          }
          const limitText = \`\${watchedCount}/\${limit}\`;
          const progressPercent = \`\${(watchedCount / limit) * 100}%\`;

          return (
            <div 
              key={campaignId} 
              className={\`rounded-[28px] p-4 flex flex-col items-center relative overflow-hidden transition-all duration-200 transform border-2 shadow-[0_6px_0_rgb(229,231,235)] \${task.active ? 'bg-white border-blue-100 shadow-[0_6px_0_rgb(191,219,254)] hover:shadow-[0_2px_0_rgb(191,219,254)] hover:translate-y-[4px] cursor-pointer' : 'bg-gray-50 border-gray-100 grayscale-[0.5] opacity-80'}\`}
              onClick={() => {
                if (!task.active) return;
                if (idx >= 3 && !isVipUser) {
                   alert("Please buy a VIP plan to access this ad campaign!");
                   navigate("/vip");
                   return;
                }
                navigate(\`/ads/\${campaignId}\`);
              }}
            >
              {task.active && (
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-[40px] opacity-20 pointer-events-none" />
              )}
              
              <div className={\`w-14 h-14 rounded-2xl mb-3 flex items-center justify-center border-2 z-10 shadow-inner relative \${task.active ? 'bg-gradient-to-tr from-cyan-100 to-blue-50 border-white' : 'bg-gray-100 border-white'}\`}>
                <span className={\`text-[2rem] filter \${task.active ? 'drop-shadow-md' : 'opacity-70'}\`}>
                  {emoji}
                </span>
                {idx >= 3 && !isVipUser && (
                  <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
                     <Lock className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              
              <h3 className={\`font-extrabold text-[12px] mb-3 tracking-wide z-10 text-center truncate w-full \${task.active ? 'text-[#2C334A]' : 'text-gray-400'}\`}>{task.name}</h3>
              
              <div className="flex flex-col w-full mt-auto z-10">
                <div className="flex justify-between items-center w-full mb-1.5">
                  <span className="text-gray-400 text-[9px] font-bold tracking-widest uppercase">Limit</span>
                  <span className="text-blue-600 text-[10px] font-black bg-blue-50 px-1.5 py-0.5 rounded shadow-sm border border-blue-100">{limitText}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full relative" style={{ width: progressPercent }}>
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-white/20" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}`;

code = code.replace(/        \{tasks\.map\(\(task, idx\) => \{[\s\S]*?\}\)\}/, replacement);
fs.writeFileSync('src/pages/Ads.tsx', code);
console.log("Ads.tsx updated");
