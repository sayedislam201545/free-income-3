import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import PremiumBackButton from "../components/PremiumBackButton";
import EmptyState from "../components/EmptyState";
import { History, XCircle, CheckCircle, Clock } from "lucide-react";
import { formatNumber } from "../lib/utils";

export default function Activity() {
  const user = useAuthStore((state) => state.user);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const txRef = collection(db, "transactions");
    const q = query(txRef, where("userId", "==", user.uid.toString()));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const acts: any[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          acts.push({
            id: doc.id,
            type: data.type || "transaction",
            amount: data.amount || data.reward || 0,
            status: data.status || "completed",
            date: new Date(data.timestamp || data.createdAt || Date.now()).getTime(),
            note: data.note || "",
            method: data.method || "",
            rejectReason: data.rejectReason || ""
          });
        });
        acts.sort((a, b) => b.date - a.date);
        setActivities(acts);
      } else {
        setActivities([]);
      }
    }, (error) => {
      console.error("SNAPSHOT_ERROR: Activity.tsx listener error", error);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'rejected') return <XCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-orange-500" />;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto w-full relative pb-20">
      <div className="flex items-center mb-6 pt-2">
        <PremiumBackButton fallbackPath="/profile" className="scale-90 origin-left mr-4" />
        <h2 className="text-xl font-bold text-gray-800">History</h2>
      </div>
      
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((act) => (
            <div key={act.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-bold text-gray-800 capitalize">{
                      act.type === 'transfer_out' ? 'Transfer' : 
                      act.type === 'transfer_in' ? 'Transfer Received' : 
                      act.type === 'lucky_draw_win' ? 'Lucky Draw Win' : 
                      act.type === 'lucky_draw_cost' ? 'Lucky Draw Play' : 
                      act.type === 'daily_checkin' ? 'Daily Check-in' : 
                      act.type === 'ads_watched' ? 'Ads Watched' : 
                      act.type === 'earn_va' ? 'Earn VA' : 
                      act.type === 'Visit Task' ? 'Tasks' : 
                      act.type === 'vip_plan' ? 'VIP Plan' : 
                      act.type === 'achievement' ? 'Badges & Achievements' : 
                      act.type === 'bonus' ? 'Bonus' : 
                      act.type
                    }</p>
                    {act.method && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">{act.method}</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(act.date).toLocaleString()}</p>
                  {act.note && <p className="text-xs text-gray-600 mt-1">{act.note}</p>}
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    ["deposit", "bonus", "refer", "achievement", "daily_checkin", "Visit Task", "ads_watched", "earn_va", "lucky_draw_win", "transfer_in"].includes(act.type) ? "text-green-500" : "text-red-500"
                  }`}>
                    {["deposit", "bonus", "refer", "achievement", "daily_checkin", "Visit Task", "ads_watched", "earn_va", "lucky_draw_win", "transfer_in"].includes(act.type) ? "+" : "-"}{formatNumber(act.amount)} VA
                  </p>
                  <div className="flex items-center justify-end space-x-1 mt-1">
                    {getStatusIcon(act.status)}
                    <p className="text-[10px] font-bold text-gray-500 uppercase">{act.status}</p>
                  </div>
                </div>
              </div>
              
              {act.status === 'rejected' && act.rejectReason && (
                 <div className="bg-red-50 p-2 rounded-lg border border-red-100 text-xs text-red-600 mt-2">
                   <span className="font-bold">Reason:</span> {act.rejectReason}
                 </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={History}
          title="No History Yet"
          description="Your transaction history will appear here."
        />
      )}
    </div>
  );
}
