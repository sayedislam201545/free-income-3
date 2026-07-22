const fs = require('fs');
let code = fs.readFileSync('src/pages/VIP.tsx', 'utf8');

// Add selectedPlan state
const stateRegex = /const \[message, setMessage\] = useState<any>\(null\);/;
code = code.replace(stateRegex, `const [message, setMessage] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);`);

const gridListRegex = /<div className="space-y-6 pb-10">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}/;

const newGridList = `{selectedPlan ? (
          <div className="space-y-6 pb-10 animate-in slide-in-from-right-4 fade-in">
            <button 
              onClick={() => setSelectedPlan(null)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-2"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-bold text-sm">Back to Plans</span>
            </button>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                                
              <div className="bg-[#12131A] backdrop-blur-2xl rounded-[32px] border border-white/[0.08] relative overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
                <div className="relative h-48 w-full overflow-hidden">
                  {selectedPlan.photo ? (
                    <img
                      src={selectedPlan.photo}
                      alt={selectedPlan.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1E1A2E] to-[#0B0A10]" />
                  )}
                                        
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#12131A]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#12131A]/80 to-transparent" />
                                        
                  <div className="absolute bottom-4 left-6 pr-6">
                    <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg uppercase">
                      {selectedPlan.title}
                    </h2>
                  </div>
                </div>
                <div className="p-6 pt-2 flex-1 flex flex-col">
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center"><Clock className="w-3 h-3 mr-1.5 opacity-70"/> Duration</p>
                      <p className="text-xl font-black text-white">{selectedPlan.duration} <span className="text-xs text-gray-400 font-medium tracking-wide">Days</span></p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                      <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1 flex items-center"><Tag className="w-3 h-3 mr-1.5 opacity-70"/> Price</p>
                      <p className="text-xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]">{selectedPlan.currency || "৳"} {selectedPlan.coin?.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mb-8 flex-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Plan Benefits</p>
                    <ul className="space-y-3.5">
                      {selectedPlan.features?.map((feature: any, idx: number) => (
                        <li
                          key={feature.id || idx}
                          className="flex items-start text-sm font-medium text-gray-300"
                        >
                          <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 mt-0.5 shrink-0 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          </div>
                          <span className="leading-snug">{feature.text || feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleBuyPlan(selectedPlan)}
                    disabled={buyingId === selectedPlan.id}
                    className="w-full relative group/btn overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.15)] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-transform duration-500 group-hover/btn:scale-105" />
                    <div className="relative px-6 py-4 flex items-center justify-center space-x-2 text-[#4A2000] font-black text-sm tracking-widest uppercase">
                      {buyingId === selectedPlan.id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>{selectedPlan.buttonText || "Upgrade Now"}</span>
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-10">
            {plans
              .filter((p) => p.status === "active" || p.status === undefined)
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((plan) => (
                <button 
                  key={plan.id} 
                  onClick={() => setSelectedPlan(plan)}
                  className="bg-[#12131A] border border-white/[0.08] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-amber-500/30 transition-all duration-300 group flex flex-col text-left active:scale-[0.98]"
                >
                  <div className="relative h-32 w-full overflow-hidden bg-[#1E1A2E]">
                    {plan.photo && (
                       <img src={plan.photo} alt={plan.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12131A] to-transparent opacity-80" />
                  </div>
                  <div className="p-4 flex flex-col items-center justify-center text-center -mt-6 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#1E1A2E] to-[#0B0A10] rounded-2xl border border-white/10 flex items-center justify-center shadow-lg mb-2 group-hover:border-amber-500/50 transition-colors">
                      <Crown className="w-6 h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    </div>
                    <h3 className="font-black text-sm text-white tracking-wide uppercase leading-tight mb-1">{plan.title}</h3>
                    <p className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">{plan.currency || "৳"}{plan.coin?.toLocaleString()}</p>
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}`;

code = code.replace(gridListRegex, newGridList);

fs.writeFileSync('src/pages/VIP.tsx', code);
