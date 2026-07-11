const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target = `  // Referral Modal States
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [refInput, setRefInput] = useState("");
  const [isSubmittingRef, setIsSubmittingRef] = useState(false);
  const [refError, setRefError] = useState("");

  useEffect(() => {
     if (user && !user.referredBy && !user.hasSkippedReferral) {
         setShowReferralModal(true);
     }
  }, [user]);`;

const replacement = `  // Referral Modal States
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [refInput, setRefInput] = useState("");
  const [isSubmittingRef, setIsSubmittingRef] = useState(false);
  const [refError, setRefError] = useState("");

  useEffect(() => {
     if (user && !user.referredBy && !user.hasSkippedReferral) {
         setShowLoader(true);
     }
  }, [user]);`;

code = code.replace(target, replacement);

const importTarget = `import AnimatedCounter from "../components/AnimatedCounter";`;
const importReplacement = `import AnimatedCounter from "../components/AnimatedCounter";
import FootballLoader from "../components/FootballLoader";`;

code = code.replace(importTarget, importReplacement);

const htmlTarget = `      <AnimatePresence>
        {showReferralModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-[#9333EA] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 mx-auto">
                    <span className="text-3xl">🎁</span>
                 </div>
                 
                 <h2 className="text-2xl font-black text-gray-900 text-center mb-2 tracking-tight">Welcome to App!</h2>
                 <p className="text-sm text-gray-500 text-center mb-6 font-medium leading-relaxed">
                   Enter a referral code to claim your <strong className="text-yellow-600">Free Starter Bonus</strong>.
                 </p>
                 
                 <div className="space-y-4">
                    <div>
                        <input 
                           type="text" 
                           placeholder="Enter referral code" 
                           value={refInput}
                           onChange={(e) => setRefInput(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-400 text-sm font-bold focus:outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] transition-all text-center"
                        />
                        {refError && <p className="text-red-500 text-xs font-bold mt-2 text-center">{refError}</p>}
                    </div>
                    
                    <button 
                       onClick={handleReferralSubmit}
                       disabled={isSubmittingRef}
                       className="w-full py-4 bg-[#8A2BE2] hover:bg-[#7926C7] text-white rounded-xl font-bold tracking-wider shadow-lg shadow-purple-500/30 transition-transform active:scale-95 disabled:opacity-60 flex items-center justify-center"
                    >
                       CLAIM BONUS
                    </button>
                    
                    <button 
                       onClick={handleSkipReferral}
                       disabled={isSubmittingRef}
                       className="w-full py-3 bg-transparent text-gray-400 hover:text-gray-600 rounded-xl text-xs font-bold tracking-wider transition-colors disabled:opacity-60"
                    >
                       SKIP FOR NOW
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

const htmlReplacement = `      <AnimatePresence>
        {showLoader && <FootballLoader onComplete={() => { setShowLoader(false); setShowReferralModal(true); }} />}
        
        {showReferralModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full blur-3xl -z-0"></div>
              
              <div className="relative z-10">
                 <div className="w-16 h-16 bg-[#9333EA] rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6 mx-auto">
                    <span className="text-3xl">🎁</span>
                 </div>
                 
                 <h2 className="text-2xl font-black text-gray-900 text-center mb-2 tracking-tight">Welcome!</h2>
                 <p className="text-sm text-gray-500 text-center mb-6 font-medium leading-relaxed">
                   Please enter a valid referral code to enter the app and claim your <strong className="text-yellow-600">Free Bonus</strong>.
                 </p>
                 
                 <div className="space-y-4">
                    <div>
                        <input 
                           type="text" 
                           placeholder="Enter referral code" 
                           value={refInput}
                           onChange={(e) => setRefInput(e.target.value)}
                           className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-400 text-sm font-bold focus:outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] transition-all text-center"
                        />
                        {refError && <p className="text-red-500 text-xs font-bold mt-2 text-center">{refError}</p>}
                    </div>
                    
                    <button 
                       onClick={handleReferralSubmit}
                       disabled={isSubmittingRef || !refInput}
                       className="w-full py-4 bg-[#8A2BE2] hover:bg-[#7926C7] text-white rounded-xl font-bold tracking-wider shadow-lg shadow-purple-500/30 transition-transform active:scale-95 disabled:opacity-60 flex items-center justify-center"
                    >
                       SUBMIT CODE
                    </button>
                 </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(htmlTarget, htmlReplacement);
fs.writeFileSync('src/pages/Dashboard.tsx', code);
console.log("Updated Dashboard.tsx");
