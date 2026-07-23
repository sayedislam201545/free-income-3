import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import PremiumBackButton from "../components/PremiumBackButton";
import {
  Crown, ChevronRight,
  AlertCircle,
  Loader2,
  ShoppingCart,
  Clock,
  Tag,
} from "lucide-react";

export default function VIP() {
  const user = useAuthStore((state) => state.user);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let unsubPlans = () => {};
    let unsubUser = () => {};
    
    import("firebase/firestore").then(m => {
       unsubPlans = m.onSnapshot(m.collection(db, "vip_plans"), (snap) => {
         const arr: any[] = [];
         snap.forEach(d => arr.push({ id: d.id, ...d.data() }));
         setPlans(arr);
         setLoading(false);
       });
       
       if (user) {
         unsubUser = m.onSnapshot(m.doc(db, "users", user.uid), (userSnap) => {
           if (userSnap.exists()) {
             setUserData(userSnap.data());
           }
         });
       } else {
         setLoading(false);
       }
    });
    
    return () => {
      unsubPlans();
      unsubUser();
    };
  }, [user]);

  const handleBuyPlan = async (plan: any) => {
    if (!user || !userData) return;

    setMessage(null);
    if (userData.vaBalance < plan.coin) {
      setMessage({
        type: "error",
        text: `Insufficient balance to purchase this plan.`,
      });
      return;
    }

    setBuyingId(plan.id);
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + Number(plan.duration));

      await updateDoc(doc(db, "users", user.uid), {
        vaBalance: increment(-plan.coin),
        isVip: true,
        vipExpiry: expiryDate.getTime(),
      });

      setUserData({
        ...userData,
        vaBalance: userData.vaBalance - plan.coin,
        isVip: true,
        vipExpiry: expiryDate.getTime(),
      });

      setMessage({
        type: "success",
        text: `Successfully activated ${plan.name}! Verified badge is now active.`,
      });
    } catch (e) {
      console.error("Purchase failed", e);
      setMessage({
        type: "error",
        text: "An error occurred during purchase. Please try again.",
      });
    } finally {
      setBuyingId(null);
    }
  };

  const isVipActive =
    userData?.isVip && userData?.vipExpiry && userData.vipExpiry > Date.now();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full relative bg-[#09090E] text-white pb-20 relative font-sans">
      {/* Premium Ambient Light */}
      <div className="fixed top-0 inset-x-0 h-[500px] bg-gradient-to-b from-amber-900/20 via-purple-900/5 to-transparent pointer-events-none -z-10" />
      <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-[10%] right-[-10%] w-[400px] h-[400px] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 relative z-10">
        <PremiumBackButton
          fallbackPath="/profile"
          className="scale-90 origin-left"
        />
        <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md shadow-lg">
          <Crown className="w-4 h-4 text-amber-400" />
          <h1 className="text-[12px] font-black tracking-[0.2em] text-white uppercase">
            VIP Pass
          </h1>
        </div>
      </div>

      <div className="px-5 mt-6 relative z-10 flex-1 flex flex-col max-w-lg mx-auto w-full">
        {/* User Status Card */}
        {userData && (
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[24px] shadow-2xl mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 blur-3xl rounded-full" />
             <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Membership Status</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-black text-white">{userData.isVip ? "PREMIUM" : "STANDARD"}</span>
                    {userData.isVip && <Crown className="w-5 h-5 text-amber-400" />}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
                  <p className="text-xl font-black text-amber-400">{userData.vaBalance?.toLocaleString() || 0} VA</p>
                </div>
             </div>
          </div>
        )}

        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-start space-x-3 backdrop-blur-md border shadow-lg ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
          >
            {message.type === "success" ? (
              <Crown className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <span className="text-sm font-bold leading-tight">{message.text}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-32 flex-1">
            <Loader2 className="w-10 h-10 animate-spin text-amber-500/50" />
          </div>
        ) : plans.filter((p) => p.status === "active" || p.status === undefined).length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 mb-6 shadow-2xl backdrop-blur-md">
               <Crown className="w-10 h-10 text-gray-600" />
            </div>
            <p className="text-gray-400 font-bold tracking-wide">No VIP Plans available.</p>
          </div>
        ) : (
          <div className="space-y-6 pb-10">
            {plans
              .filter((p) => p.status === "active" || p.status === undefined)
              .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
              .map((plan) => (
                <div key={plan.id} className="relative group">
                  {/* Subtle Glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-amber-500/20 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                  
                  <div className="bg-[#12131A] backdrop-blur-2xl rounded-[32px] border border-white/[0.08] relative overflow-hidden shadow-2xl flex flex-col transition-all duration-300">
                    
                    {/* Header Image Area */}
                    <div className="relative h-48 w-full overflow-hidden">
                      {plan.photo ? (
                        <img
                          src={plan.photo}
                          alt={plan.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#1E1A2E] to-[#0B0A10]" />
                      )}
                      
                      {/* Gradient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-[#12131A]" />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#12131A]/80 to-transparent" />
                      
                      {/* Title */}
                      <div className="absolute bottom-4 left-6 pr-6">
                        <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-lg uppercase">
                          {plan.title}
                        </h2>
                      </div>
                    </div>

                    <div className="p-6 pt-2 flex-1 flex flex-col">
                      {/* Price & Duration Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-white/[0.03] border border-white/[0.05] rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 flex items-center"><Clock className="w-3 h-3 mr-1.5 opacity-70"/> Duration</p>
                          <p className="text-xl font-black text-white">{plan.duration} <span className="text-xs text-gray-400 font-medium tracking-wide">Days</span></p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-center shadow-inner">
                          <p className="text-[10px] font-bold text-amber-500/70 uppercase tracking-widest mb-1 flex items-center"><Tag className="w-3 h-3 mr-1.5 opacity-70"/> Price</p>
                          <p className="text-xl font-black text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]">{plan.currency || "৳"} {plan.coin?.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-8 flex-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Plan Benefits</p>
                        <ul className="space-y-3.5">
                          {plan.features?.map((feature: any, idx: number) => (
                            <li
                              key={feature.id || idx}
                              className="flex items-start text-sm font-medium text-gray-300"
                            >
                              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mr-3 mt-0.5 shrink-0 shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              </div>
                              <span className="leading-snug">{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleBuyPlan(plan)}
                        disabled={buyingId === plan.id}
                        className="w-full relative group/btn overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(251,191,36,0.15)] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 transition-transform duration-500 group-hover/btn:scale-105" />
                        <div className="relative px-6 py-4 flex items-center justify-center space-x-2 text-[#4A2000] font-black text-sm tracking-widest uppercase">
                          {buyingId === plan.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <span>{plan.buttonText || "Upgrade Now"}</span>
                              <ChevronRight className="w-4 h-4 opacity-70" />
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                    
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}