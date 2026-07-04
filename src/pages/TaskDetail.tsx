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
      remaining: 35 - Math.floor(timeSpent)
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
    window.open(task?.targetUrl || "https://google.com", "_blank");
    const randTime = Math.floor(Math.random() * 11) + 30; // 30 to 40
    startTracking(randTime);
  };

  const handleAppSubmit = async () => {
    if (!note || !profileLink) {
      alert("Please fill all fields.");
      return;
    }
    if (!user || !user.uid) {
      alert("Please login first.");
      return;
    }
    setIsUploading(true);
    try {
      const imageUrls: string[] = [];
      for (let i = 0; i < screenshots.length; i++) {
        const file = screenshots[i];
        if (file) {
          const storageRef = ref(storage, `submissions/${user.uid}/${Date.now()}_${i}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          imageUrls.push(url);
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
      alert("Submission sent successfully! It is now pending admin approval.");
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      if (err.code === "storage/unauthorized") {
         alert("Storage permission denied. Admin needs to allow uploads in Firebase Rules.");
      } else {
         alert("Failed to submit task. Please try again.");
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
    <div className="flex flex-col min-h-screen -mx-4 -my-6 px-4 py-6 bg-gray-50 text-gray-900 relative">
      {/* Header */}
      <header className="flex items-center mb-6 pt-2 relative z-10">
        <PremiumBackButton fallbackPath="/task" className="scale-90 origin-left mr-4" />
        <h1 className="text-2xl font-black text-[#2C334A] tracking-tight">Task Details</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 space-y-6">
        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 blur-[30px] rounded-full pointer-events-none group-hover:bg-blue-200 transition-colors" />
          
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={() => window.open(task.youtubeUrl || "https://youtube.com", "_blank")}
              className="flex items-center space-x-1 bg-red-50 text-red-600 px-2.5 py-1.5 rounded-lg text-[10px] font-bold border border-red-100 shadow-sm active:scale-95 transition-transform"
            >
              <Video className="w-3.5 h-3.5" />
              <span className="uppercase tracking-wider">Tutorial</span>
            </button>
          </div>

          <div className="relative z-10">
            <h2 className="text-xl font-black text-[#2C334A] mb-2 leading-tight pr-24">{task.title}</h2>
            
            <div className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 px-3 py-1.5 rounded-lg mb-5 shadow-sm">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">🪙</div>
              <span className="text-blue-700 font-bold text-sm tracking-tight">+{task.reward} <span className="text-xs font-semibold opacity-80">Coins</span></span>
            </div>

            <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100 rounded-xl p-4 mb-2 shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-400" />
              <h3 className="font-extrabold text-[10px] text-indigo-700 uppercase tracking-widest mb-1.5 opacity-80">
                Instructions
              </h3>
              <p className="text-[12px] text-indigo-900 font-medium whitespace-pre-wrap leading-relaxed">
                {task.description ||
                  "Follow the instructions to complete this task and earn your reward. Make sure to complete all steps accurately to receive coins."}
              </p>
            </div>
          </div>
        </div>

        {/* Action Section based on Category */}
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3">
          {(category === "joined" || category === "registration") && (
            <button
              onClick={() =>
                window.open(task.targetUrl || "https://t.me", "_blank")
              }
              className="w-full bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(30,58,138)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(30,58,138)]"
            >
              <span>{category === "registration" ? "REGISTRATION NOW" : "JOIN NOW"}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {category === "visit" && (
            isTracking ? (
              <button
                onClick={cancelTracking}
                className="w-full bg-gradient-to-b from-gray-400 to-gray-500 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(107,114,128)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(107,114,128)]"
              >
                <span>⏳ PLEASE WAIT... {timeRemaining}S</span>
              </button>
            ) : (
              <button
                onClick={handleStartVisit}
                className="w-full bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(30,58,138)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(30,58,138)]"
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
                className="w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(21,128,61)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(21,128,61)]"
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

                        <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Upload Screenshots (Max 3)
              </label>
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <label
                    key={i}
                    className="flex-1 aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors relative overflow-hidden"
                  >
                    {screenshots[i] ? (
                      <img src={URL.createObjectURL(screenshots[i])} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <ImageIcon className="w-6 h-6" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const newFiles = [...screenshots];
                          newFiles[i] = e.target.files[0];
                          setScreenshots(newFiles);
                        }
                      }} 
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
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

            <div className="mb-6">
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

            <button
              disabled={isUploading}
              onClick={handleAppSubmit}
              className={`w-full py-4 ${isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-95'} text-white rounded-xl font-bold shadow-md transition-all`}
            >
              {isUploading ? 'Uploading & Submitting...' : 'Submit to Admin'}
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
