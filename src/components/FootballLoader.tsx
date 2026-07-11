import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function FootballLoader({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); // 0: ready, 1: kick, 2: goal, 3: fade out

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500); // kick starts
    const t2 = setTimeout(() => setStage(2), 1500); // goal!
    const t3 = setTimeout(() => setStage(3), 2500); // fade out text
    const t4 = setTimeout(() => onComplete(), 3000); // done

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-gradient-to-br from-green-600 to-green-900 flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="relative w-full max-w-sm h-64 flex items-center justify-center">
        {/* Goal Net */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-24 h-32 border-4 border-white border-l-0 rounded-r-lg opacity-80" style={{ perspective: "200px" }}>
            <div className="w-full h-full border border-white/30 grid grid-cols-3 grid-rows-4" style={{ transform: "rotateY(-20deg)" }}>
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="border border-white/30" />
                ))}
            </div>
        </div>

        {/* Player / Kicker */}
        <motion.div
          animate={stage >= 1 ? { x: 20, rotate: 15 } : { x: 0, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute left-10 top-1/2 -translate-y-1/2 text-6xl drop-shadow-2xl"
        >
          🏃‍♂️
        </motion.div>

        {/* Football */}
        <motion.div
          animate={stage >= 1 ? { x: 200, y: -20, rotate: 720, scale: 0.8 } : { x: 0, y: 30, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="absolute left-24 top-1/2 -translate-y-1/2 text-4xl drop-shadow-xl"
        >
          ⚽
        </motion.div>
        
        {/* Goal Text */}
        <AnimatePresence>
          {stage === 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="absolute inset-0 flex items-center justify-center z-10"
            >
              <h1 className="text-6xl font-black text-white italic drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                GOAL!
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 text-white/80 font-bold text-lg tracking-widest uppercase animate-pulse">
        Loading App...
      </div>
    </motion.div>
  );
}
