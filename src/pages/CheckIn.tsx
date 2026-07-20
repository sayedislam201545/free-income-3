import { useFeatureToggles } from "../hooks/useFeatureToggles";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useAdTracker } from "../hooks/useAdTracker";
import { useState, useEffect } from "react";
import { playSound } from "../lib/sounds";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import PremiumBackButton from "../components/PremiumBackButton";

declare global {
    interface Window {
        show_9955574?: () => void;
    }
}

export default function CheckIn() {
  const featureToggles = useFeatureToggles();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  // Preload ad script
  useEffect(() => {
    const scriptId = 'ad-sdk-script';
    if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = '//libtl.com/sdk.js';
        script.setAttribute('data-zone', '9955574');
        script.setAttribute('data-sdk', 'show_9955574');
        document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
     if (!user) return;
     const fetchHistory = async () => {
         try {
         const histRef = query(collection(db, 'daily_bonus_history'), where('userId', '==', user.uid.toString()));
         const snapshot = await getDocs(histRef);
         let lastCheckIn = (user as any).lastCheckIn || 0;
         let docsData: any[] = [];
         if (!snapshot.empty) {
             docsData = snapshot.docs.map(doc => doc.data()).sort((a, b) => b.date - a.date);
             if (docsData[0].date > lastCheckIn) {
                 lastCheckIn = docsData[0].date;
             }
         }
         if (lastCheckIn > 0) {
             
             const twentyFourHours = 24 * 60 * 60 * 1000;
             if (Date.now() - lastCheckIn < twentyFourHours) {
                 setIsCheckedIn(true);
                 setTimeRemaining(Math.floor((lastCheckIn + twentyFourHours - Date.now()) / 1000));
             }

             // Calculate streak based on 24h windows
             const dates = docsData.map(d => new Date(d.date).setHours(0,0,0,0));
             let currentStreak = 0;
             const today = new Date().setHours(0,0,0,0);
             const yesterday = today - 86400000;

             if (dates.length > 0) {
                 if (dates[0] === today || Date.now() - lastCheckIn < twentyFourHours) {
                     currentStreak = 1;
                     let checkDate = yesterday;
                     if (dates[0] !== today && dates[0] !== yesterday) {
                         checkDate = dates[0] - 86400000;
                     }
                     for (let i = 1; i < dates.length; i++) {
                         if (dates[i] === checkDate) {
                             currentStreak++;
                             checkDate -= 86400000;
                         } else {
                             break;
                         }
                     }
                 } else if (dates[0] === yesterday) {
                     currentStreak = 1;
                     let checkDate = yesterday - 86400000;
                     for (let i = 1; i < dates.length; i++) {
                         if (dates[i] === checkDate) {
                             currentStreak++;
                             checkDate -= 86400000;
                         } else {
                             break;
                         }
                     }
                 }
             }
             setStreak(currentStreak);
         }
         } catch (e) {
             console.error("fetchHistory error:", e);
         }
     };
     fetchHistory();
  }, [user?.uid]);

  useEffect(() => {
      let interval: NodeJS.Timeout;
      if (timeRemaining !== null && timeRemaining > 0) {
          interval = setInterval(() => {
              setTimeRemaining(prev => prev! - 1);
          }, 1000);
      } else if (timeRemaining === 0) {
          setIsCheckedIn(false);
          setTimeRemaining(null);
      }
      return () => clearInterval(interval);
  }, [timeRemaining]);

    const { startTracking, isTracking, timeRemaining: adTimeRemaining, cancelTracking } = useAdTracker(() => {
      // Reward logic
      (async () => {
          setIsLoading(false);
          setIsCheckedIn(true);
          setTimeRemaining(24 * 60 * 60); // 24 hours
          setStreak(streak + 1);
          
          const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();
          const baseReward = 30;
          const reward = isVipUser ? Math.floor(baseReward * 1.05) : baseReward;

          const { increment, updateDoc, doc, addDoc, collection } = await import("firebase/firestore");
          const now = Date.now();
          await updateDoc(doc(db, 'users', user!.uid), {
              vaBalance: increment(reward),
              lastCheckIn: now
          });
          await addDoc(collection(db, 'daily_bonus_history'), {
              userId: user!.uid.toString(),
              date: Date.now(),
              reward
          });
          
          
      })();
  }, () => {
      setIsLoading(false);
  });

  const handleCheckIn = () => {
      if (isCheckedIn || !user) return;
      
      if (window.show_9955574) {
          window.show_9955574();
      }
      setIsLoading(true);
      startTracking(15);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full relative -mx-4 -my-6 px-4 py-6 bg-gradient-to-b from-[#8ab4f8] to-[#EAF0FF] relative">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 text-gray-900 relative z-10 pt-2">
        <PremiumBackButton fallbackPath="/" className="scale-90 origin-left" />
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center font-bold text-white shadow-sm border border-purple-300">
                VA
            </div>
        </div>
        <div className="w-8" />
      </header>

      {/* Balance display */}
      <div className="relative z-10 mb-6 flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full primary-gradient flex items-center justify-center font-bold text-white shadow-lg border-2 border-purple-300">
              VA
          </div>
          <span className="text-3xl font-bold text-gray-800 drop-shadow-sm">{user?.vaBalance}</span>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm mb-6 relative z-10">
        <div className="flex justify-between items-baseline mb-4">
            <h2 className="text-xl font-bold text-[#2C334A]">Daily Check-in</h2>
            <span className="text-xs text-gray-500 font-medium">Consecutive {streak} days</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-100 rounded-full mb-6 overflow-hidden shadow-inner">
            <div className="h-full bg-crypto-primary rounded-full transition-all duration-500" style={{ width: `${Math.min((streak % 7 || 7) / 7 * 100, 100)}%` }} />
        </div>

        <div className="flex justify-between space-x-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                const dayInCycle = day;
                const currentCycle = Math.floor((streak - (isCheckedIn ? 1 : 0)) / 7) * 7;
                const absoluteDay = currentCycle + dayInCycle;
                const claimed = absoluteDay <= streak && (absoluteDay < streak || isCheckedIn);
                const isToday = absoluteDay === streak + (isCheckedIn ? 0 : 1);
                const reward = absoluteDay % 7 === 0 ? 100 : 30; // Day 7 is 100

                return (
                <div key={day} className={`flex flex-col items-center p-2 rounded-[20px] min-w-[55px] border-2 transition-all ${claimed ? 'bg-crypto-primary border-crypto-primary text-white shadow-md' : isToday ? 'bg-purple-50 border-crypto-primary text-crypto-primary shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                    <span className={`text-[10px] font-bold mb-2 uppercase tracking-wider ${claimed ? 'text-white/80' : isToday ? 'text-crypto-primary/80' : 'text-gray-400'}`}>Day {dayInCycle}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-[12px] mb-1 ${claimed ? 'bg-white/20 text-white' : isToday ? 'bg-crypto-primary text-white shadow-inner' : 'bg-gray-200 text-gray-500'}`}>
                        {claimed ? '✓' : 'VA'}
                    </div>
                    <span className={`text-[11px] font-black ${claimed ? 'text-white' : isToday ? 'text-crypto-primary' : 'text-gray-400'}`}>
                        {claimed ? 'Done' : `+${reward}`}
                    </span>
                </div>
            )})}
        </div>

        {isTracking ? (
          <button
            onClick={cancelTracking}
            className="w-full py-4 rounded-full font-bold text-[15px] shadow-[0_6px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,0,0,0.1)] bg-gradient-to-b from-gray-400 to-gray-500 text-white border border-gray-600"
          >
            CANCEL (WAIT {adTimeRemaining}S)
          </button>
        ) : (
          <button
             onClick={handleCheckIn}
             disabled={isCheckedIn || isLoading}
             className={`w-full py-4 rounded-full font-bold text-[15px] shadow-[0_6px_0_rgba(0,0,0,0.1)] transition-all active:translate-y-[4px] active:shadow-[0_2px_0_rgba(0,0,0,0.1)] ${isCheckedIn ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 shadow-none active:translate-y-0' : 'bg-gradient-to-b from-crypto-primary to-[#6A3ACC] text-white border border-purple-800'}`}>
              {isLoading ? "Please wait..." : isCheckedIn ? `Claim again in ${formatTime(timeRemaining || 0)}` : "Check in now"}
          </button>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-white rounded-[32px] p-6 shadow-sm relative z-10">
          <h3 className="font-bold text-[#2C334A] mb-4">Check-in instructions</h3>
          <ol className="text-sm text-gray-500 space-y-3 list-decimal list-inside">
              <li>Log in daily and click (Sign in now) to receive corresponding rewards</li>
              <li>Continuous check-in can increase your earnings</li>
          </ol>
      </div>

    </div>
  );
}
