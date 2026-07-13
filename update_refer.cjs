const fs = require('fs');
let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

const stateTarget = `  const inviteCode = user?.uid ? user.uid : "R_12M26U";`;
const stateReplacement = `  const [refInput, setRefInput] = useState("");
  const [isSubmittingRef, setIsSubmittingRef] = useState(false);
  const [refError, setRefError] = useState("");

  const handleReferralSubmit = async () => {
      if (!refInput) {
         setRefError("Please enter a referral code.");
         return;
      }
      if (refInput === user?.uid) {
         setRefError("You cannot refer yourself.");
         return;
      }
      setIsSubmittingRef(true);
      setRefError("");
      try {
          const referrerRef = doc(db, "users", refInput);
          const referrerSnap = await getDoc(referrerRef);
          if (!referrerSnap.exists()) {
              setRefError("Invalid referral code.");
              setIsSubmittingRef(false);
              return;
          }
          const referrerData = referrerSnap.data();
          const referrerIsVip = referrerData?.isVip && referrerData?.vipExpiry && referrerData?.vipExpiry > Date.now();
          const rewardAmount = (user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now()) ? 275 : 250;
          const referrerReward = referrerIsVip ? 275 : 250;
          
          const userRef = doc(db, "users", user!.uid);
          await updateDoc(userRef, {
             referredBy: refInput,
             vaBalance: increment(rewardAmount)
          });
          
          await updateDoc(referrerRef, {
             referralCount: increment(1),
             vaBalance: increment(referrerReward)
          });
          
          setRefInput("");
      } catch (e) {
          console.error(e);
          setRefError("Failed to apply referral.");
      } finally {
          setIsSubmittingRef(false);
      }
  };

  const inviteCode = user?.uid ? user.uid : "R_12M26U";`;

code = code.replace(stateTarget, stateReplacement);

const uiTarget = `        {/* Code Section */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/80">`;
const uiReplacement = `        {/* Enter Code Section (Only if not referred) */}
        {(!user?.referredBy) && (
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-purple-100/80 relative overflow-hidden mb-4">
           <div className="flex items-center space-x-2 mb-4 relative z-10">
              <div className="bg-purple-50 p-1.5 rounded-lg">
                <Gift className="w-4 h-4 text-[#9333EA]" />
              </div>
              <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase">Enter Invite Code</h3>
           </div>
           
           <div className="relative z-10 space-y-3">
              <input 
                 type="text" 
                 placeholder="Enter friend's code..." 
                 value={refInput}
                 onChange={(e) => setRefInput(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 placeholder-gray-400 text-sm font-bold focus:outline-none focus:border-[#9333EA] focus:ring-1 focus:ring-[#9333EA] transition-all"
              />
              {refError && <p className="text-red-500 text-[10px] font-bold px-1">{refError}</p>}
              
              <button 
                 onClick={handleReferralSubmit}
                 disabled={isSubmittingRef || !refInput}
                 className="w-full py-3.5 bg-[#8A2BE2] hover:bg-[#7926C7] text-white rounded-xl font-bold tracking-wider shadow-md shadow-purple-500/20 transition-transform active:scale-95 disabled:opacity-60 flex items-center justify-center text-xs"
              >
                 {isSubmittingRef ? "APPLYING..." : "CLAIM BONUS"}
              </button>
           </div>
        </div>
        )}

        {/* Code Section */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/80">`;

code = code.replace(uiTarget, uiReplacement);
fs.writeFileSync('src/pages/Refer.tsx', code);
console.log("Refer updated successfully");
