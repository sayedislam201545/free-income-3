import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import PremiumBackButton from "../components/PremiumBackButton";
import EmptyState from "../components/EmptyState";
import { Users } from "lucide-react";

export default function ReferralsLog() {
  const user = useAuthStore((state) => state.user);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    let unsub = () => {};
    import("firebase/firestore").then(m => {
        const usersRef = m.collection(db, "users");
        const q = m.query(usersRef, m.where("referredBy", "==", user.uid));
        unsub = m.onSnapshot(q, (snapshot) => {
            const logData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            
            logData.sort((a: any, b: any) => {
                const tA = new Date(a.createdAt || 0).getTime();
                const tB = new Date(b.createdAt || 0).getTime();
                return tB - tA;
            });

            setLogs(logData);
            setLoading(false);
        });
    });
    return () => unsub();
  }, [user]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-md mx-auto w-full relative(100vh-80px)] bg-gray-50 text-gray-900 pb-10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center mb-6 relative z-10 pt-4 px-4">
        <PremiumBackButton
          fallbackPath="/refer"
          className="scale-90 origin-left mr-4"
        />
        <h1 className="text-[14px] font-bold tracking-[0.2em] text-gray-800 uppercase">
          Referral Log
        </h1>
      </div>

      <div className="px-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-3 w-16 bg-gray-100 rounded"></div>
                  </div>
                </div>
                <div className="w-16 h-6 rounded-lg bg-gray-200"></div>
              </div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-sm mt-4">
            <EmptyState
              icon={Users}
              title="No friends have registered yet"
              description="Share your link to start generating team level-ups!"
            />
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <div
                key={log.id || index}
                className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                    {log.username ? log.username.substring(0, 2).toUpperCase() : "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">
                      {log.username || "Unknown User"}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleDateString()
                        : "Recent"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500 font-bold bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                  <span className="text-[10px]">🪙</span>
                  <span className="text-xs">Success</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
