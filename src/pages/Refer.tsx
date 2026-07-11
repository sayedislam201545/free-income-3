import { db } from "../lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { Gift, Users, Coins, Share2, Copy, AlertCircle, TrendingUp, Link as LinkIcon, Info, ChevronRight, ArrowRightCircle, Shield, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import PremiumBackButton from "../components/PremiumBackButton";

export default function Refer() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [copiedCode, setCopiedCode] = useState(false);
  
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

  const inviteCode = user?.uid ? user.uid : "R_12M26U";
    
  const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
  const rewardAmount = isVipUser ? 275 : 250;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full relative overflow-hidden bg-[#FAFAFA] text-gray-900 pb-10">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 pt-6">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100">
           <PremiumBackButton fallbackPath="/profile" className="scale-90" />
        </div>
        
        <div className="flex space-x-2">
          <button 
             onClick={() => {
                 if (botSetting?.referralHowItWorksLink) {
                     if ((window as any).Telegram?.WebApp) {
                         (window as any).Telegram.WebApp.openLink(botSetting.referralHowItWorksLink);
                     } else {
                         window.open(botSetting.referralHowItWorksLink, '_blank');
                     }
                 }
             }}
             className="bg-white px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 active:scale-95 transition-transform"
          >
             <TrendingUp className="w-4 h-4 text-[#9333EA]" />
             <span className="text-[11px] font-bold text-gray-800 uppercase tracking-wide">How it works</span>
          </button>
          
          <Link to="/refer/log" className="bg-white px-4 py-2.5 rounded-2xl flex items-center space-x-2 shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-gray-100 active:scale-95 transition-transform text-[#9333EA]">
             <Users className="w-4 h-4" />
             <span className="text-[11px] font-bold uppercase tracking-wide">Referral Log ({user?.referralCount || 0})</span>
          </Link>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Banner */}
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-white rounded-[24px] p-6 shadow-sm border border-purple-100/50 flex items-center relative overflow-hidden">
           <div className="flex-1 pr-4 relative z-10">
              <h4 className="text-[#9333EA] text-[10px] font-black uppercase tracking-wider mb-2">Refer & Earn More</h4>
              <h2 className="text-[22px] font-black text-gray-900 leading-[1.15] mb-3 tracking-tight">Invite Friends &<br/>Level Up Together!</h2>
              <p className="text-xs text-gray-600 font-medium leading-relaxed max-w-[200px]">
                 Invite your friends, complete tasks together and earn <span className="text-yellow-500 font-bold">🪙 +{rewardAmount} Coins</span> for every successful registration.
              </p>
           </div>
           {/* Illustration Placeholder */}
           <div className="w-28 h-28 shrink-0 relative z-10 flex items-center justify-center">
              <img src="https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-4996155-4159585.png" alt="Gift" className="w-full h-full object-contain drop-shadow-xl" />
           </div>
           
           {/* Decorative elements */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/40 rounded-full blur-3xl -z-0"></div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100/80 relative overflow-hidden">
              <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-[16px] bg-[#9333EA] flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <Users className="w-6 h-6 text-white" />
                 </div>
              </div>
              <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">My Referrals</h3>
              <p className="text-4xl font-black text-gray-900 mb-1">{user?.referralCount || 0}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Friends</p>
              <Users className="absolute -bottom-4 -right-4 w-24 h-24 text-purple-50 opacity-50" />
           </div>
           
           <div className="bg-[#FFFDF7] rounded-[24px] p-5 shadow-sm border border-yellow-100/80 relative overflow-hidden">
              <div className="flex items-center mb-4">
                 <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                    <Coins className="w-6 h-6 text-white" />
                 </div>
              </div>
              <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">Earned Coins</h3>
              <div className="flex items-baseline mb-1">
                <span className="text-orange-500 font-black text-4xl mr-1">+{(user?.referralCount || 0) * rewardAmount}</span>
                <span className="text-yellow-500 text-lg">🪙</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Earned</p>
              <TrendingUp className="absolute -bottom-4 -right-4 w-24 h-24 text-yellow-50 opacity-50" />
           </div>
        </div>

        {/* Code Section */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100/80">
           <div className="flex items-center space-x-2 mb-4">
              <div className="bg-purple-50 p-1.5 rounded-lg">
                <LinkIcon className="w-4 h-4 text-[#9333EA]" />
              </div>
              <h3 className="text-[11px] font-bold tracking-widest text-gray-900 uppercase">Your Unique Invite Code</h3>
           </div>
           
           <div className="bg-purple-50/50 rounded-xl flex items-center justify-between p-2 border border-purple-100/50 mb-6">
              <span className="font-bold text-[#9333EA] pl-3 tracking-wide text-sm truncate">{inviteCode}</span>
              <button
                onClick={handleCopyCode}
                className="bg-white text-[#9333EA] hover:text-purple-700 px-4 py-2.5 rounded-lg text-[11px] font-bold tracking-wide flex items-center border border-purple-100 transition-colors shadow-sm active:scale-95 shrink-0 ml-2"
              >
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                {copiedCode ? "COPIED" : "COPY"}
              </button>
           </div>
        </div>

        {/* Policy Info */}
        <div className="bg-[#FFFDF7] rounded-[24px] p-5 flex flex-col space-y-4 border border-orange-100/80 shadow-sm relative overflow-hidden">
           <div className="flex items-start space-x-3 relative z-10">
              <Shield className="w-6 h-6 text-orange-500 shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-orange-600 uppercase tracking-widest mb-1.5">Referral Policy (Rules)</h4>
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">
                   The invited friend must register a new account using your referral link or code. Once registered, an instant bonus of <strong className="text-orange-500">250 Coins</strong> will be credited to your main balance immediately.
                </p>
              </div>
           </div>
           <button 
             onClick={() => {
                 if (botSetting?.referralHowItWorksLink) {
                     if ((window as any).Telegram?.WebApp) {
                         (window as any).Telegram.WebApp.openLink(botSetting.referralHowItWorksLink);
                     } else {
                         window.open(botSetting.referralHowItWorksLink, '_blank');
                     }
                 }
             }}
             className="bg-white self-end text-[#9333EA] px-4 py-2.5 rounded-xl text-[10px] font-bold tracking-widest uppercase flex items-center shadow-sm border border-orange-100 relative z-10"
           >
              How it works <ChevronRight className="w-3.5 h-3.5 ml-1" />
           </button>
        </div>
      </div>
    </div>
  );
}
