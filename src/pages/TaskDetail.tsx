import { useUIStore } from '../store/useUIStore';
import { AnimatePresence, motion } from "motion/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Video,
  Link as LinkIcon,
  ExternalLink,
  Image as ImageIcon,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useAdTracker } from "../hooks/useAdTracker";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { db, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { playSound } from "../lib/sounds";
import PremiumBackButton from "../components/PremiumBackButton";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visitModalState, setVisitModalState] = useState<{
    show: boolean;
    type: "success" | "early_exit";
    reward?: number;
    timeSpent?: number;
    remaining?: number;
  }>({ show: false, type: "success" });
  
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [screenshots, setScreenshots] = useState<(File | null)[]>([null, null, null]);
  const [note, setNote] = useState("");
  const [profileLink, setProfileLink] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "tasks", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTask({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);


  // Visit Task States
  const { startTracking, isTracking, checkCompletion, timeRemaining, cancelTracking } = useAdTracker(() => {
    handleVisitComplete();
  }, (timeSpent) => {
    setVisitModalState({
      show: true,
      type: "early_exit",
      timeSpent: Math.floor(timeSpent),
      remaining: 40 - Math.floor(timeSpent)
    });
  });

  const handleVisitComplete = async () => {
    
    const { user: currentUser } = useAuthStore.getState();
    const reward = task?.reward || 50;
    if (currentUser) {
      const { increment, updateDoc, doc } = await import("firebase/firestore");
      await updateDoc(doc(db, "users", currentUser.uid), {
         vaBalance: increment(reward)
      });

      await addDoc(collection(db, "task_completions"), {
        userId: currentUser.uid,
        taskId: task?.id || "unknown",
        timestamp: new Date().toISOString(),
        reward: reward,
      });

      await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        type: "Visit Task",
        amount: reward,
        currency: "VA",
        timestamp: new Date().toISOString(),
        status: "completed"
      });
    }
    playSound("reward");
    setVisitModalState({ show: true, type: "success", reward });
  };

  const handleStartVisit = () => {
    const url = task?.targetUrl || "https://google.com";
    if ((window as any).Telegram?.WebApp?.openLink) {
      (window as any).Telegram.WebApp.openLink(url);
    } else {
      window.open(url, "_blank");
    }
    startTracking(40);
  };

  const handleAppSubmit = async () => {
    if (!note || !profileLink) {
      useUIStore.getState().addToast("Please fill all fields.");
      return;
    }
    if (!user || !user.uid) {
      useUIStore.getState().addToast("Please login first.");
      return;
    }
    setIsUploading(true);
    try {
      // Get imgbb API token
      const botSettingSnap = await getDoc(doc(db, "settings", "bot_setting"));
      const imgbbToken = botSettingSnap.exists() ? botSettingSnap.data().imgbbApiToken || botSettingSnap.data().imgbbApi : null;
      
      if (!imgbbToken) {
        useUIStore.getState().addToast("Imgbb API Token is not configured by admin.");
        setIsUploading(false);
        return;
      }

      const imageUrls: string[] = [];
      for (let i = 0; i < screenshots.length; i++) {
        const file = screenshots[i];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          
          try {
            const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbToken}`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.success) {
              imageUrls.push(data.data.url);
            } else {
              throw new Error("Imgbb upload failed");
            }
          } catch (e) {
             useUIStore.getState().addToast("Failed to upload image to Imgbb.");
             setIsUploading(false);
             return;
          }
        }
      }

      await addDoc(collection(db, "task_submissions"), {
        userId: user.uid,
        username: user.username || user.firstName || 'User',
        taskId: task?.id || "unknown",
        taskTitle: task?.title || "Unknown Task",
        reward: task?.reward || 0,
        note,
        profileLink,
        imageUrls,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      useUIStore.getState().addToast("Submission sent successfully! It is now pending admin approval.");
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      if (err.code === "storage/unauthorized") {
         useUIStore.getState().addToast("Storage permission denied. Admin needs to allow uploads in Firebase Rules.");
      } else {
         useUIStore.getState().addToast("Failed to submit task. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-blue-600 font-bold">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-bold">
        Task not found
      </div>
    );
  }

  const category = task.category || "joined";

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full relative -mx-4 -my-6 px-4 py-6 bg-gray-50 text-gray-900 relative">
      {/* Header Area */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-b-[40px] z-0 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-8 w-4 h-4 bg-white/30 rotate-45" />
        <div className="absolute top-12 right-20 w-2 h-2 bg-white/20 rotate-45" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      <header className="flex items-center mb-6 pt-4 px-2 relative z-10">
        <PremiumBackButton fallbackPath="/task" className="scale-90 origin-left mr-3" theme="light" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Task Details</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 space-y-6 relative z-10 px-2">
        <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-black text-[#1E2330] leading-tight max-w-[65%]">{task.title}</h2>
            <button
              onClick={() => {
                const url = task.youtubeUrl || "https://youtube.com";
                if ((window as any).Telegram?.WebApp?.openLink) {
                  (window as any).Telegram.WebApp.openLink(url);
                } else {
                  window.open(url, "_blank");
                }
              }}
              className="flex items-center space-x-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 shadow-sm active:scale-95 transition-transform shrink-0"
            >
              <Video className="w-4 h-4" />
              <span className="uppercase tracking-wide">Tutorial</span>
            </button>
          </div>

          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl mb-6 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">🪙</div>
            <span className="text-indigo-600 font-bold text-sm tracking-tight">+{task.reward} <span className="text-xs font-medium text-gray-500">Coins</span></span>
          </div>

          <div className="bg-[#F4F4FA] border-l-4 border-indigo-500 rounded-r-xl rounded-l-sm p-4 mb-2">
            <div className="flex items-center space-x-2 mb-2">
               <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <h3 className="font-bold text-xs text-indigo-700 uppercase tracking-wide">
                 Instructions
               </h3>
            </div>
            <p className="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
              {task.description ||
                "Follow the instructions to complete this task and earn your reward. Make sure to complete all steps accurately to receive coins."}
            </p>
          </div>
        </div>

        {/* Action Section based on Category */}
        {/* Action Section based on Category */}
        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4 p-2">
          {(category === "joined" || category === "registration") && (
            <button
              onClick={() => {
                const url = task.targetUrl || "https://t.me";
                if ((window as any).Telegram?.WebApp?.openLink) {
                  (window as any).Telegram.WebApp.openLink(url);
                } else {
                  window.open(url, "_blank");
                }
              }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              <span>{category === "registration" ? "REGISTRATION NOW" : "JOIN NOW"}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {category === "visit" && (
            isTracking ? (
              <button
                onClick={cancelTracking}
                className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>⏳ PLEASE WAIT... {timeRemaining}S</span>
              </button>
            ) : (
              <button
                onClick={handleStartVisit}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>START VISITING</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )
          )}

          {(category === "registration" || category === "vip") &&
            !showSubmitForm && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>SUBMIT PROOF</span>
                <Send className="w-4 h-4" />
              </button>
            )}
        </div>

        {/* App Registration Form */}
        {showSubmitForm && (
          <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-gray-100 mt-6 animate-in fade-in slide-in-from-bottom-8 relative overflow-hidden">
            <h3 className="font-black text-xl text-[#2C334A] tracking-tight mb-6">Submit Your Proof</h3>

                        <div className="mb-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">User Name</label>
                <input type="text" value={user?.username || user?.firstName || "Unknown User"} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">User ID</label>
                <input type="text" value={user?.telegramId || user?.uid || ""} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Task ID</label>
                <input type="text" value={task?.id || ""} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Profile Link
              </label>
              <input
                type="url"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Note / Task details
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Write your note here..."
              />
            </div>

            <button
              disabled={isUploading}
              onClick={handleAppSubmit}
              className={`w-full py-4 ${isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-95'} text-white rounded-xl font-bold shadow-md transition-all`}
            >
              {isUploading ? 'Submitting...' : 'Submit to Admin'}
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {visitModalState.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl relative overflow-hidden flex flex-col items-center border border-gray-100"
            >
              <div
                className={`absolute top-0 inset-x-0 h-32 ${visitModalState.type === "success" ? "bg-gradient-to-b from-green-50 to-white" : "bg-gradient-to-b from-red-50 to-white"} pointer-events-none`}
              />

              <div
                className={`w-24 h-24 ${visitModalState.type === "success" ? "bg-gradient-to-br from-green-300 to-green-500 shadow-green-500/30" : "bg-gradient-to-br from-red-300 to-red-500 shadow-red-500/30"} rounded-3xl mb-6 shadow-lg flex items-center justify-center relative z-10 rotate-3 border-4 border-white`}
              >
                <span className="text-5xl filter drop-shadow-md">
                  {visitModalState.type === "success" ? "🎉" : "⚠️"}
                </span>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-2 relative z-10 text-center">
                {visitModalState.type === "success" ? "Congratulations!" : "Early Exit"}
              </h2>

              <div className="text-sm text-gray-500 text-center mb-8 relative z-10 font-medium">
                {visitModalState.type === "success" ? (
                  <>
                    <p className="mb-2">Visit task completed!</p>
                    <p className="text-green-600 font-bold text-lg">
                      You received {visitModalState.reward} Coins!
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-red-600 font-bold">আপনি নির্ধারিত সময়ের আগেই বের হয়ে এসেছেন তাই আপনার টাস্কটিকে কাউন্ড করা হয় নাই!</p>
                    <p>আপনি ছিলেন: <span className="font-bold text-gray-800">{visitModalState.timeSpent}</span> সেকেন্ড</p>
                    <p>বাকি ছিল: <span className="font-bold text-gray-800">{visitModalState.remaining}</span> সেকেন্ড</p>
                    <p className="mt-2 text-xs">তাই কোনো Coin প্রদান করা হয়নি।</p>
                  </>
                )}
              </div>

              <button
                onClick={() => setVisitModalState({ ...visitModalState, show: false })}
                className="w-full py-4 bg-gray-100 text-gray-800 rounded-2xl font-bold shadow-sm hover:bg-gray-200 transition-all active:scale-95"
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
