const fs = require('fs');

const code = `import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Gift, Users, Coins, Share2, Copy, AlertCircle, TrendingUp, Link as LinkIcon, Info, ChevronRight, Send } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PremiumBackButton from "../components/PremiumBackButton";

export default function Refer() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [botSetting, setBotSetting] = useState<any>(null);

  useEffect(() => {
    const fetchBotSetting = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "bot_setting"));
        if (snap.exists()) {
          setBotSetting(snap.data());
        }
      } catch(e) {}
    };
    fetchBotSetting();
  }, []);

  const inviteCode = user?.uid
    ? \`R_\${user.uid.substring(0, 6).toUpperCase()}\`
    : "R_12M26U";
    
  const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
  const rewardAmount = isVipUser ? 275 : 250;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  const handleSubmitCode = async () => {
    if (!inputCode) {
      alert("Please enter an invite code.");
      return;
    }
    if (user?.referredBy) {
      alert("You have already used a referral code.");
      return;
    }
    
    setIsSubmitting(true);
    try {
       // Just a simulated submit for now.
       // In a real app we'd verify the code, find the referrer, and update both balances.
       const userRef = doc(db, "users", user!.uid);
       await updateDoc(userRef, {
         referredBy: inputCode,
         vaBalance: (user?.vaBalance || 0) + rewardAmount
       });
       alert("Referral successful! You earned bonus coins.");
       window.location.reload();
    } catch(e) {
      alert("Failed to submit code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FE] text-gray-900 pb-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100">
           <PremiumBackButton fallbackPath="/profile" className="scale-90" />
        </div>
        
        <div className="flex space-x-2">
          <button className="bg-white px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 active:scale-95 transition-transform">
             <TrendingUp className="w-4 h-4 text-purple-600" />
             <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">How it works</span>
          </button>
          
          <Link to="/refer/log" className="bg-white px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 active:scale-95 transition-transform text-purple-600">
             <Users className="w-4 h-4" />
             <span className="text-[11px] font-bold uppercase tracking-wide">Referral Log ({user?.referralCount || 0})</span>
          </Link>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50 flex items-center relative overflow-hidden">
           <div className="flex-1 pr-4 relative z-10">
              <h4 className="text-purple-600 text-[10px] font-black uppercase tracking-wider mb-2">Refer & Earn More</h4>
              <h2 className="text-2xl font-black text-gray-900 leading-tight mb-3 tracking-tight">Invite Friends &<br/>Level Up Together!</h2>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                 Invite your friends, complete tasks together and earn <span className="text-yellow-500 font-bold">🪙 +{rewardAmount} Coins</span> for every successful registration.
              </p>
           </div>
           {/* Illustration Placeholder */}
           <div className="w-28 h-28 shrink-0 relative z-10 flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-50 rounded-2xl">
              <span className="text-5xl drop-shadow-md">🎁</span>
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -z-0"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                 </div>
                 <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">My Referrals</span>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{user?.referralCount || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Friends</p>
           </div>
           
           <div className="bg-orange-50/50 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-orange-100/50">
              <div className="flex items-center space-x-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shadow-sm">
                    <span className="text-xl">🪙</span>
                 </div>
                 <span className="text-[10px] font-bold text-gray-900 uppercase tracking-widest">Earned Coins</span>
              </div>
              <div className="flex items-baseline mb-1">
                <span className="text-orange-500 font-black text-3xl mr-1">+{(user?.referralCount || 0) * rewardAmount}</span>
                <span className="text-orange-400 text-sm">🪙</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Earned</p>
           </div>
        </div>

        {/* Code Section */}
        <div className="bg-white rounded-[24px] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-50">
           <div className="flex items-center space-x-2 mb-4">
              <LinkIcon className="w-4 h-4 text-purple-600" />
              <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase">Your Unique Invite Code</h3>
           </div>
           
           <div className="bg-gray-50 rounded-2xl flex items-center justify-between p-2 border border-gray-100 mb-6">
              <span className="font-black text-purple-600 pl-4 tracking-wider text-lg">{inviteCode}</span>
              <button
                onClick={handleCopyCode}
                className="bg-white text-purple-600 hover:text-purple-700 px-4 py-3 rounded-xl text-[11px] font-black tracking-wide flex items-center border border-gray-100 transition-colors shadow-sm active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                {copiedCode ? "COPIED" : "COPY CODE"}
              </button>
           </div>
           
           <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase mb-2">Enter Invite Code <span className="text-gray-400 font-medium normal-case tracking-normal">(If you have one)</span></h3>
           <div className="space-y-3">
              <input 
                 type="text" 
                 placeholder="Enter invite code here" 
                 value={inputCode}
                 onChange={(e) => setInputCode(e.target.value)}
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button 
                 onClick={handleSubmitCode}
                 disabled={isSubmitting || !!user?.referredBy}
                 className="w-full bg-[#7000FF] hover:bg-[#5E00D6] text-white py-4 rounded-2xl font-bold text-xs tracking-wide shadow-[0_4px_15px_rgba(112,0,255,0.3)] flex items-center justify-center transition-transform active:scale-95 disabled:opacity-60"
              >
                 {user?.referredBy ? "ALREADY REFERRED" : "SUBMIT & GET REFERRED"}
              </button>
           </div>
        </div>

        {/* Policy Info */}
        <div className="bg-orange-50 rounded-[20px] p-5 flex flex-col space-y-3 border border-orange-100/50">
           <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-700 leading-relaxed font-medium">
                 <strong className="text-orange-600">Referral Policy (Rules):</strong> The invited friend must register a new account using your referral link or code. Once registered, an instant bonus of <strong className="text-orange-500">250 Coins</strong> will be credited to your main balance immediately.
              </p>
           </div>
           <button className="bg-white self-end text-purple-600 px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center shadow-sm border border-orange-100">
              How it works <ChevronRight className="w-3 h-3 ml-1" />
           </button>
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/pages/Refer.tsx', code);
