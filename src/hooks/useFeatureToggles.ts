import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useFeatureToggles() {
  const [toggles, setToggles] = useState({
    registration: true,
    transfer: true,
    deposit: true,
    withdraw: true,
    luckyDraw: true,
    dailyCheckin: true
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "feature_toggles"), (snap) => {
      if (snap.exists()) {
        setToggles(prev => ({ ...prev, ...snap.data() }));
      }
    });
    return () => unsub();
  }, []);

  return toggles;
}
