const fs = require('fs');
let code = fs.readFileSync('src/pages/Activity.tsx', 'utf8');

const oldRender = `                <div className="text-right">
                  <p className={\`font-bold \${(act.type === "deposit" || act.type === "bonus") ? "text-green-500" : "text-red-500"}\`}>
                    {(act.type === "deposit" || act.type === "bonus") ? "+" : "-"}{formatNumber(act.amount)} VA
                  </p>`;

const newRender = `                <div className="text-right">
                  <p className={\`font-bold \${
                    ["deposit", "bonus", "refer", "achievement", "daily_checkin", "Visit Task", "ads_watched", "earn_va", "lucky_draw_win", "transfer_in"].includes(act.type) ? "text-green-500" : "text-red-500"
                  }\`}>
                    {["deposit", "bonus", "refer", "achievement", "daily_checkin", "Visit Task", "ads_watched", "earn_va", "lucky_draw_win", "transfer_in"].includes(act.type) ? "+" : "-"}{formatNumber(act.amount)} VA
                  </p>`;

code = code.replace(oldRender, newRender);

// Let's also format the type names for display so "Visit Task" shows as "Tasks", "bonus" as "Bonus", etc.
const oldTypeRender = `<p className="font-bold text-gray-800 capitalize">{act.type}</p>`;
const newTypeRender = `<p className="font-bold text-gray-800 capitalize">{
                      act.type === 'transfer_out' ? 'Transfer' : 
                      act.type === 'transfer_in' ? 'Transfer Received' : 
                      act.type === 'lucky_draw_win' ? 'Lucky Draw Win' : 
                      act.type === 'lucky_draw_cost' ? 'Lucky Draw Play' : 
                      act.type === 'daily_checkin' ? 'Daily Check-in' : 
                      act.type === 'ads_watched' ? 'Ads Watched' : 
                      act.type === 'earn_va' ? 'Earn VA' : 
                      act.type === 'Visit Task' ? 'Tasks' : 
                      act.type === 'vip_plan' ? 'VIP Plan' : 
                      act.type === 'achievement' ? 'Badges & Achievements' : 
                      act.type === 'bonus' ? 'Bonus' : 
                      act.type
                    }</p>`;

code = code.replace(oldTypeRender, newTypeRender);

fs.writeFileSync('src/pages/Activity.tsx', code);
