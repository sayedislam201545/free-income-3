const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

const target = `  const startBonusAd = async () => {
    // Trigger ad SDK
    const scriptId = "ad-sdk-script";
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    const triggerAd = async () => {
      // @ts-ignore
      if (window.show_9955574) {
        // @ts-ignore
        window.show_9955574();
      }
      setShowBonusModal(false);
      const { user: currentUser } = useAuthStore.getState();
      if (currentUser) {
        const { increment, updateDoc, doc, addDoc, collection } = await import("firebase/firestore");
        await updateDoc(doc(db, "users", currentUser.uid), {
           vaBalance: increment(bonusAdReward)
        });
          
        await addDoc(collection(db, "task_history"), {
          userId: currentUser.uid,
          taskId: "slider_bonus_ad",
          reward: bonusAdReward,
          completedAt: Date.now(),
        });
        await addDoc(collection(db, "transactions"), {
          userId: currentUser.uid,
          type: "bonus",
          amount: bonusAdReward,
          status: "completed",
          createdAt: Date.now(),
          note: "Slider Bonus Ad",
        });

        playSound("reward");
        setBonusModalState({ show: true, type: "success", reward: bonusAdReward });
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "//libtl.com/sdk.js";
      script.setAttribute("data-zone", "9955574");
      script.setAttribute("data-sdk", "show_9955574");
      script.onload = () => {
        script.setAttribute("data-loaded", "true");
        triggerAd();
      };
      document.body.appendChild(script);
    } else {
      if (script.getAttribute("data-loaded") === "true") {
        triggerAd();
      } else {
        script.addEventListener("load", triggerAd, { once: true });
      }
    }
  };`;

const replacement = `  const startBonusAd = async () => {
    try {
        const { getDoc, doc } = await import("firebase/firestore");
        const snap = await getDoc(doc(db, "settings", "ads_config"));
        if (snap.exists()) {
            const config = snap.data();
            if (config.monetagScriptUrl && config.monetagZoneId && config.monetagSdk) {
                const { triggerMonetagAd } = await import("../lib/monetag");
                triggerMonetagAd(config.monetagScriptUrl, config.monetagZoneId, config.monetagSdk);
            }
        }
    } catch(e) {
        console.error("Failed to load ad config", e);
    }
    
    setShowBonusModal(false);
    const { user: currentUser } = useAuthStore.getState();
    if (currentUser) {
      const { increment, updateDoc, doc, addDoc, collection } = await import("firebase/firestore");
      await updateDoc(doc(db, "users", currentUser.uid), {
         vaBalance: increment(bonusAdReward)
      });
        
      await addDoc(collection(db, "task_history"), {
        userId: currentUser.uid,
        taskId: "slider_bonus_ad",
        reward: bonusAdReward,
        completedAt: Date.now(),
      });
      await addDoc(collection(db, "transactions"), {
        userId: currentUser.uid,
        type: "bonus",
        amount: bonusAdReward,
        status: "completed",
        createdAt: Date.now(),
        note: "Slider Bonus Ad",
      });

      playSound("reward");
      setBonusModalState({ show: true, type: "success", reward: bonusAdReward });
    }
  };`;

if(code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/pages/Dashboard.tsx', code);
    console.log("Replaced successfully!");
} else {
    console.log("Target not found!");
}
