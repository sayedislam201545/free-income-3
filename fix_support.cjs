const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const targetAddButton = `setSupportAgents([...supportAgents, { id: Date.now().toString(), name: "", role: "", link: "", avatar: "" }]);`;
const replaceAddButton = `setSupportAgents([...supportAgents, { id: Date.now().toString(), name: "", role: "", link: "", image: "" }]);`;

code = code.replace(targetAddButton, replaceAddButton);

const targetInputs = `<div><label className="text-xs text-gray-400">Name</label><input type="text" value={agent.name} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, name: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Role</label><input type="text" value={agent.role} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, role: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Link (e.g. https://t.me/user)</label><input type="text" value={agent.link} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, link: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>`;

const replaceInputs = `<div><label className="text-xs text-gray-400">Name</label><input type="text" value={agent.name} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, name: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Role</label><input type="text" value={agent.role} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, role: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Link (e.g. https://t.me/user)</label><input type="text" value={agent.link} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, link: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" /></div>
                    <div><label className="text-xs text-gray-400">Photo Link (URL)</label><input type="text" value={agent.image || ''} onChange={(e) => setSupportAgents(supportAgents.map(a => a.id === agent.id ? {...a, image: e.target.value} : a))} className="w-full bg-[#0B0E14] border border-white/10 rounded-xl p-3 text-white" placeholder="https://example.com/photo.png" /></div>`;

code = code.replace(targetInputs, replaceInputs);
fs.writeFileSync('src/pages/Admin.tsx', code);
