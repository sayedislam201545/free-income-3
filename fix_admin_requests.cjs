const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `                    <div>
                      <h4 className="font-bold text-white text-sm">{req.method || 'Unknown Method'}</h4>
                      <p className="text-xs text-gray-400 mt-1">{req.accountDetails || req.address || 'No details'}</p>
                      <p className="text-[10px] text-gray-500 mt-1">{new Date(req.timestamp || Date.now()).toLocaleString()}</p>
                    </div>`;

const replacement = `                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-white text-sm">{req.method || 'Unknown Method'}</h4>
                        <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-gray-300">{req.username || req.userId}</span>
                      </div>
                      
                      <div className="mt-2 space-y-1 text-xs text-gray-400">
                        {req.fiatAmount && <p><span className="font-bold text-gray-500">Fiat Amount:</span> {req.fiatAmount}</p>}
                        {(req.accountDetails || req.address) && <p><span className="font-bold text-gray-500">Address/Details:</span> {req.accountDetails || req.address}</p>}
                        {req.sender && <p><span className="font-bold text-gray-500">Sender/Account:</span> {req.sender}</p>}
                        {req.txId && <p><span className="font-bold text-gray-500">TrxID:</span> {req.txId}</p>}
                        {req.memo && <p><span className="font-bold text-gray-500">Memo/Notes:</span> {req.memo}</p>}
                      </div>
                      
                      <p className="text-[10px] text-gray-500 mt-2">{new Date(req.timestamp || Date.now()).toLocaleString()}</p>
                    </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/pages/Admin.tsx', code);
