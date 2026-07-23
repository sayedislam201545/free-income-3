import { useUIStore } from '../store/useUIStore';
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PremiumBackButton from "../components/PremiumBackButton";
import { motion, AnimatePresence } from "framer-motion";
import { playPremiumClick } from "../utils/audio";
import { Play, CheckCircle2, Video } from "lucide-react";
import { useAdTracker } from "../hooks/useAdTracker";
import { useAuthStore } from "../store/useAuthStore";

export default function AdDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [dailyWatched, setDailyWatched] = useState(0);
  
  const [modalState, setModalState] = useState<{
    show: boolean;
    type: "success" | "error";
    timeSpent?: number;
    remaining?: number;
    reward?: number;
  }>({ show: false, type: "success" });

  const user = useAuthStore((state) => state.user);
  const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
  const [adsConfig, setAdsConfig] = useState<any>({
    dailyAdsLimit: (isVipUser ? 20 : 10),
    adWatchDuration: 15,
    rewardPerAd: (isVipUser ? 2 : 1),
  });

  useEffect(() => {
    import("firebase/firestore").then(m => {
       const unsubConfig = m.onSnapshot(m.doc(db, "settings", "ads_rewards_config"), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const specificConfig = isVipUser ? data.vip : data.normal;
            const settings = data.settings || {};
            if (specificConfig) {
               setAdsConfig({ 
                   ...settings, 
                   ...specificConfig, 
                   adWatchDuration: settings.adsSecond !== undefined ? settings.adsSecond : 15,
                   dailyAdsLimit: specificConfig.adsLimit !== undefined ? specificConfig.adsLimit : (isVipUser ? 20 : 10),
                   rewardPerAd: specificConfig.reward !== undefined ? specificConfig.reward : (isVipUser ? 2 : 1)
               });
            } else {
               setAdsConfig({ 
                   ...settings, 
                   adWatchDuration: settings.adsSecond !== undefined ? settings.adsSecond : 15,
                   dailyAdsLimit: (isVipUser ? 20 : 10),
                   rewardPerAd: (isVipUser ? 2 : 1)
               });
            }
          }
       });
       return () => unsubConfig();
    });
  }, [isVipUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser || !id) return;
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const today = new Date().toDateString();
          
          const campaignData = (userData.adCampaignsWatched && userData.adCampaignsWatched[id]) || {};
          
          if (campaignData.lastDate !== today) {
            setDailyWatched(0);
          } else {
            setDailyWatched(campaignData.dailyWatched || 0);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [id]);

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

  const handleWatchAd = () => {
    playPremiumClick();
    if (dailyWatched >= (adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10))) {
      useUIStore.getState().addToast("Daily limit reached for this campaign!");
      return;
    }
    
    // Open Monetag ad
    if (window.show_9955574) {
        window.show_9955574();
    }
    startTracking(adsConfig.adWatchDuration || 15);
  };

  const handleAdComplete = async () => {
    if (!auth.currentUser || !id) return;
    const userRef = doc(db, "users", auth.currentUser.uid);
    try {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const addedCoins = adsConfig.rewardPerAd !== undefined ? adsConfig.rewardPerAd : (isVipUser ? 2 : 1);
        
        const today = new Date().toDateString();
        const currentCampaigns = userData.adCampaignsWatched || {};
        const currentData = currentCampaigns[id] || {};
        const currentDaily = (currentData.lastDate === today) ? (currentData.dailyWatched || 0) : 0;
        const newDaily = currentDaily + 1;
        
        await updateDoc(userRef, {
          [`adCampaignsWatched.${id}`]: {
              dailyWatched: newDaily,
              lastDate: today
          },
          vaBalance: (userData.vaBalance || 0) + addedCoins
        });
        const { addDoc, collection } = await import("firebase/firestore");
        await addDoc(collection(db, 'transactions'), {
            userId: auth.currentUser.uid.toString(),
            type: 'ads_watched',
            amount: addedCoins,
            status: 'completed',
            createdAt: Date.now(),
            note: 'Ad Watch Reward'
        });
        
        setDailyWatched(newDaily);
        
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans pb-10">
      <header className="flex items-center justify-between p-4 relative z-10">
        <PremiumBackButton theme="dark" />
        <button className="flex items-center space-x-1 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md border border-gray-300 text-gray-900 font-bold text-xs">
          <span>ENG</span>
          <span className="text-[10px] text-gray-600">▼</span>
        </button>
      </header>

      <div className="flex-1 flex flex-col px-4 max-w-md mx-auto w-full z-10">
        
        <div className="relative flex justify-center mt-6 mb-8">
            <div className="w-32 h-32 relative flex items-center justify-center">
               <div className="absolute inset-0 bg-[#4F46E5]/20 blur-[40px] rounded-full" />
               <div className="w-24 h-24 bg-gradient-to-tr from-[#2a2a4a] to-[#3a3a6a] rounded-[30px] shadow-2xl border border-gray-300 flex items-center justify-center relative z-10">
                  <Play className="w-10 h-10 text-gray-900 fill-white ml-1 shadow-lg" />
               </div>
            </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Rewarded Ad</h1>
          <p className="text-gray-600 text-sm font-medium">Earn {adsConfig.rewardPerAd !== undefined ? adsConfig.rewardPerAd : (isVipUser ? 2 : 1)} VA Tokens for each advertisement.</p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-600 uppercase tracking-widest">Daily Limit</span>
              <span className="text-blue-400">{dailyWatched}/{adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10)}</span>
            </div>
            <div className="h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${(dailyWatched / (adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10))) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {isTracking ? (
            <div className="mt-4 p-8 bg-gray-900/50 backdrop-blur-md rounded-[32px] border border-gray-200 text-center flex flex-col items-center">
               <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute font-black text-blue-400 text-xl">{timeRemaining}</div>
               </div>
               <h3 className="text-gray-900 font-bold mb-2">Watching Ad...</h3>
               <p className="text-gray-600 text-sm mb-6 max-w-[200px]">Please wait until the timer finishes to get rewarded.</p>
               
               <button 
                  onClick={cancelTracking}
                  className="px-6 py-2.5 rounded-full bg-red-500/10 text-red-500 font-bold text-sm border border-red-500/20 active:scale-95 transition-transform"
               >
                  Cancel
               </button>
            </div>
        ) : (
            <button 
                onClick={handleWatchAd}
                disabled={dailyWatched >= (adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10))}
                className="mt-4 w-full py-5 rounded-[24px] bg-gradient-to-br from-blue-600 to-blue-800 text-gray-900 font-black text-lg tracking-wide shadow-[0_6px_0_rgb(30,58,138),0_15px_30px_rgba(37,99,235,0.3)] active:shadow-[0_0px_0_rgb(30,58,138)] active:translate-y-[6px] transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center space-x-3"
            >
               <Video className="w-6 h-6" />
               <span>{dailyWatched >= (adsConfig.dailyAdsLimit !== undefined ? adsConfig.dailyAdsLimit : (isVipUser ? 20 : 10)) ? "LIMIT REACHED" : "WATCH AD NOW"}</span>
            </button>
        )}
      </div>

      <AnimatePresence>
        {modalState.show && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              {modalState.type === "success" ? (
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Reward Claimed!</h3>
                  <p className="text-gray-600 font-medium mb-6">
                    You earned <span className="text-green-400 font-bold">+{modalState.reward} VA Tokens</span> for watching this ad.
                  </p>
                  <button 
                    onClick={() => setModalState({ ...modalState, show: false })}
                    className="w-full py-4 bg-green-600 text-gray-900 rounded-2xl font-black text-lg tracking-wide shadow-[0_4px_0_rgb(22,101,52)] active:shadow-[0_0px_0_rgb(22,101,52)] active:translate-y-[4px] transition-all"
                  >
                    AWESOME
                  </button>
                </div>
              ) : (
                <div className="text-center relative z-10">
                  <div className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-red-500 text-4xl">!</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2">Ad Cancelled</h3>
                  <p className="text-gray-600 font-medium mb-2">
                    You only watched {modalState.timeSpent}s.
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    You need to watch {modalState.remaining}s more to claim the reward.
                  </p>
                  <button 
                    onClick={() => setModalState({ ...modalState, show: false })}
                    className="w-full py-4 bg-red-600 text-gray-900 rounded-2xl font-black text-lg tracking-wide shadow-[0_4px_0_rgb(153,27,27)] active:shadow-[0_0px_0_rgb(153,27,27)] active:translate-y-[4px] transition-all"
                  >
                    GOT IT
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
