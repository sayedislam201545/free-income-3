import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PremiumBackButton from "../components/PremiumBackButton";
import { motion, AnimatePresence } from "framer-motion";
import { playPremiumClick } from "../utils/audio";
import { Play } from "lucide-react";
import { useAdTracker } from "../hooks/useAdTracker";

export default function AdDetail() {
  const navigate = useNavigate();
  const [adCount, setAdCount] = useState(0);
  const [dailyWatched, setDailyWatched] = useState(0);
  
  const [countdown, setCountdown] = useState<number | null>(null);
  
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: "success" | "error";
    timeSpent?: number;
    remaining?: number;
    reward?: number;
  }>({ show: false, type: "success" });

  const [adsConfig, setAdsConfig] = useState<any>({
    dailyAdsLimit: 50,
    adWatchDuration: 15,
    rewardPerAd: 50,
    monetagZoneId: "",
    monetagSdk: ""
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const snap = await getDoc(doc(db, "settings", "ads_config"));
        if (snap.exists()) {
          setAdsConfig({ ...adsConfig, ...snap.data() });
        }
      } catch (e) {}
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const today = new Date().toDateString();
          if (userData.lastAdDate !== today) {
            setAdCount(0);
            setDailyWatched(0);
          } else {
            setAdCount(userData.adCount || 0);
            setDailyWatched(userData.dailyAdsWatched || 0);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, []);

  const { startTracking, isTracking, timeRemaining, cancelTracking } = useAdTracker(() => {
    handleAdComplete();
  }, (timeSpent) => {
    const required = adsConfig.adWatchDuration || 15;
    setModalState({
      show: true,
      type: "error",
      timeSpent: Math.floor(timeSpent),
      remaining: required - Math.floor(timeSpent),
    });
  });

  useEffect(() => {
    let cTimer: any;
    if (countdown !== null && countdown > 0) {
      cTimer = setInterval(() => setCountdown(prev => (prev as number) - 1), 1000);
    } else if (countdown === 0) {
      setCountdown(null);
    }
    return () => clearInterval(cTimer);
  }, [countdown]);

  const handleWatchAd = () => {
    playPremiumClick();
    if (dailyWatched >= (adsConfig.dailyAdsLimit || 50)) {
      alert("Daily limit reached!");
      return;
    }
    
    // Open Monetag ad or fallback
    if (adsConfig.monetagSdk && window[adsConfig.monetagSdk as any]) {
        (window as any)[adsConfig.monetagSdk]();
    } else if (adsConfig.monetagZoneId) {
        const url = `https://monetag.com/?zoneId=${adsConfig.monetagZoneId}`;
        if ((window as any).Telegram?.WebApp) {
          (window as any).Telegram.WebApp.openLink(url);
        } else {
          window.open(url, "_blank");
        }
    } else {
        const url = "https://www.google.com";
        if ((window as any).Telegram?.WebApp) {
          (window as any).Telegram.WebApp.openLink(url);
        } else {
          window.open(url, "_blank");
        }
    }
    
    startTracking(adsConfig.adWatchDuration || 15);
  };

  const handleAdComplete = async () => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        let newCount = (userData.adCount || 0) + 1;
        let newDaily = (userData.dailyAdsWatched || 0) + 1;
        
        let addedCoins = 0;
        if (newCount >= 5) {
          addedCoins = adsConfig.rewardPerAd || 50;
          newCount = 0;
        }
        
        await updateDoc(userRef, {
          adCount: newCount,
          dailyAdsWatched: newDaily,
          vaBalance: (userData.vaBalance || 0) + addedCoins,
          lastAdDate: new Date().toDateString()
        });
        
        setAdCount(newCount);
        setDailyWatched(newDaily);
        setCountdown(60); // 1 minute cooldown
        
        setModalState({
          show: true,
          type: "success",
          reward: addedCoins
        });
      }
    } catch(e) {
      console.error(e);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] flex flex-col font-sans pb-10">
      <header className="flex items-center justify-between p-4 relative z-10">
        <PremiumBackButton theme="dark" />
        <button className="flex items-center space-x-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 text-white font-bold text-xs">
          <span>ENG</span>
          <span className="text-[10px] text-gray-400">▼</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col px-4 max-w-md mx-auto w-full z-10">
        
        <div className="relative flex justify-center mt-6 mb-8">
            <div className="w-32 h-32 relative flex items-center justify-center">
               <div className="absolute inset-0 bg-[#4F46E5]/20 blur-[40px] rounded-full" />
               <div className="w-24 h-24 bg-gradient-to-tr from-[#1A1A32] to-[#242442] rounded-[30px] rotate-12 shadow-2xl border border-white/5 flex items-center justify-center absolute">
               </div>
               <div className="w-24 h-24 bg-gradient-to-tr from-[#2a2a4a] to-[#3a3a6a] rounded-[30px] shadow-2xl border border-white/10 flex items-center justify-center relative z-10">
                  <Play className="w-10 h-10 text-white fill-white ml-1 shadow-lg" />
               </div>
            </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white mb-2">Rewarded Ad</h1>
          <p className="text-gray-400 text-sm font-medium">Earn {adsConfig.rewardPerAd || 50} Coins for each 5 advertisements.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-400">AD PROGRESS</span>
              <span className="text-white">{adCount} / 5</span>
            </div>
            <div className="w-full bg-[#1A1A32] rounded-full h-2">
              <div className="bg-[#4F46E5] h-2 rounded-full" style={{ width: `${(adCount / 5) * 100}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-400">DAILY LIMIT</span>
              <span className="text-white">{dailyWatched} / {adsConfig.dailyAdsLimit || 50}</span>
            </div>
            <div className="w-full bg-[#1A1A32] rounded-full h-2">
              <div className="bg-[#10B981] h-2 rounded-full" style={{ width: `${(dailyWatched / (adsConfig.dailyAdsLimit || 50)) * 100}%` }}></div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#4F46E5]/20 to-[#9333EA]/20 border border-[#4F46E5]/30 rounded-2xl p-4 mb-auto relative overflow-hidden">
           <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-30 bg-cover bg-center" style={{ backgroundImage: "url('/icons/coins-stack.png')" }} />
           <div className="relative z-10">
              <h3 className="text-white font-bold mb-1">Earn More Coins</h3>
              <p className="text-xs text-gray-400 max-w-[70%]">Complete your daily watch limit to claim the premium reward pool.</p>
           </div>
        </div>

        <div className="mt-8 relative">
          {countdown !== null ? (
            <div className="w-full bg-[#1A1A32] border border-white/10 py-4 rounded-2xl font-black text-lg text-yellow-500 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Time Remaining</span>
              <span className="font-mono text-xl tracking-widest">{formatTime(countdown)}</span>
            </div>
          ) : isTracking ? (
            <button onClick={cancelTracking} className="w-full relative group">
              <div className="w-full bg-orange-500 text-white rounded-2xl font-black text-[15px] h-14 flex items-center justify-center uppercase tracking-wider">
                <span className="animate-spin mr-2">⏳</span>
                WAIT {timeRemaining}S
              </div>
            </button>
          ) : (
            <button onClick={handleWatchAd} className="w-full relative group">
              <div className="w-full bg-[#4F46E5] text-white rounded-2xl font-black text-[15px] h-14 flex items-center justify-center uppercase tracking-wider shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                WATCH AD NOW
              </div>
            </button>
          )}
          
          {countdown === null && (
            <p className="text-center text-[11px] text-gray-500 mt-4">
              Stay on the ad for 15 seconds<br/>to progress towards the reward.
            </p>
          )}
        </div>

      </div>

      <AnimatePresence>
        {modalState.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#151A23] rounded-3xl p-8 w-full max-w-sm border border-white/10 relative overflow-hidden flex flex-col items-center"
            >
              <div
                className={`w-20 h-20 ${modalState.type === "success" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"} rounded-full mb-6 border-2 flex items-center justify-center`}
              >
                <span className="text-3xl">
                  {modalState.type === "success" ? "🎉" : "⚠️"}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mb-2 text-center">
                {modalState.type === "success" ? "Congratulations!" : "Early Exit"}
              </h2>
              <div className="text-sm text-gray-400 text-center mb-8">
                {modalState.type === "success" ? (
                  <>
                    <p className="mb-2">Ad watched successfully!</p>
                    {modalState.reward! > 0 ? (
                      <p className="text-green-400 font-bold text-lg">
                        You received {modalState.reward} Coins!
                      </p>
                    ) : (
                      <p>Progress: {adCount}/5 towards reward.</p>
                    )}
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-red-400">আপনি ১৫ সেকেন্ড এর আগেই বের হয়ে এসেছেন তাই আপবার এড টাকে কাউন্ড করা হয় নাই!</p>
                    <p>আপনি দেখেছেন: <span className="text-white font-bold">{modalState.timeSpent}</span> সেকেন্ড</p>
                    <p>বাকি ছিল: <span className="text-white font-bold">{modalState.remaining}</span> সেকেন্ড</p>
                    <p className="mt-2 text-xs">তাই আপনি কোনো Coin পাননি।</p>
                  </>
                )}
              </div>
              <button
                onClick={() => setModalState({ ...modalState, show: false })}
                className="w-full py-3.5 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all active:scale-95"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
