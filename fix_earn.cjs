const fs = require('fs');
let code = fs.readFileSync('src/pages/Earn.tsx', 'utf8');

const targetState = `  const [status, setStatus] = useState<'idle' | 'mining' | 'claimable'>('idle');`;

const replacementState = `  const [status, setStatus] = useState<'idle' | 'mining' | 'claimable'>('idle');
  const [minedSoFar, setMinedSoFar] = useState(0);
  const [pendingAction, setPendingAction] = useState<'start' | 'claim' | null>(null);

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

  const { startTracking } = (require("../hooks/useAdTracker")).useAdTracker(async () => {
      if (pendingAction === 'start') {
          if (!user) return;
          const end = new Date(Date.now() + MINING_DURATION);
          await updateDoc(doc(db, 'users', user.uid), {
            miningStartTime: new Date().toISOString(),
            miningEndTime: end.toISOString(),
          });
          setStatus('mining');
          setEndTime(end);
          setPendingAction(null);
      } else if (pendingAction === 'claim') {
          if (!user) return;
          const userRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const isVipUser = user.isVip && user.vipExpiry && user.vipExpiry > Date.now();
            const reward = isVipUser ? Math.floor(MINING_REWARD * 1.05) : MINING_REWARD;
            
            const { increment } = await import("firebase/firestore");
            await updateDoc(userRef, {
              vaBalance: increment(reward),
              miningStartTime: null,
              miningEndTime: null,
            });
            alert("Claimed " + reward + " VA tokens successfully!");
          }
          
          setStatus('idle');
          setEndTime(null);
          setProgress(0);
          setMinedSoFar(0);
          setTimeLeft('24:00:00');
          setPendingAction(null);
      }
  });`;

code = code.replace(targetState, replacementState);

const targetSimulateStart = `  const handleStartEarning = () => {
    simulateAd(async () => {
      if (!user) return;
      const end = new Date(Date.now() + MINING_DURATION);
      await updateDoc(doc(db, 'users', user.uid), {
        miningStartTime: new Date().toISOString(),
        miningEndTime: end.toISOString(),
      });
      setStatus('mining');
      setEndTime(end);
    });
  };`;

const replacementSimulateStart = `  const handleStartEarning = () => {
    setPendingAction('start');
    if (window.show_9955574) {
        window.show_9955574();
    }
    startTracking(15);
  };`;

code = code.replace(targetSimulateStart, replacementSimulateStart);

const targetSimulateClaim = `  const handleClaim = () => {
    simulateAd(async () => {
      if (!user) return;
      
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const isVipUser = user.isVip && user.vipExpiry && user.vipExpiry > Date.now();
        const reward = isVipUser ? Math.floor(MINING_REWARD * 1.05) : MINING_REWARD;
        
        const { increment } = await import("firebase/firestore");
        await updateDoc(userRef, {
          vaBalance: increment(reward),
          miningStartTime: null,
          miningEndTime: null,
        });
        alert(\`Claimed \${reward} VA tokens successfully!\` + (isVipUser ? ' (VIP +5%)' : ''));
      }
      
      setStatus('idle');
      setEndTime(null);
      setProgress(0);
      setTimeLeft('24:00:00');
    });
  };`;

const replacementSimulateClaim = `  const handleClaim = () => {
    setPendingAction('claim');
    if (window.show_9955574) {
        window.show_9955574();
    }
    startTracking(15);
  };`;
code = code.replace(targetSimulateClaim, replacementSimulateClaim);

const targetElapsed = `          const elapsed = now - start;
          setProgress((elapsed / MINING_DURATION) * 100);`;
const replacementElapsed = `          const elapsed = now - start;
          setProgress((elapsed / MINING_DURATION) * 100);
          setMinedSoFar((elapsed / MINING_DURATION) * MINING_REWARD);`;
code = code.replace(targetElapsed, replacementElapsed);

const targetMiningText = `                  <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase mt-1">Mining Active</span>`;
const replacementMiningText = `                  <span className="text-white/80 text-[10px] font-bold tracking-widest uppercase mt-1">Mining: {minedSoFar.toFixed(4)} VA</span>`;
code = code.replace(targetMiningText, replacementMiningText);

const targetRateBox = `        <div className="bg-white rounded-3xl p-6 border-2 border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center mb-6">
          <p className="text-gray-500 text-sm font-medium mb-1">Current Reward Rate</p>
          <h3 className="text-3xl font-black text-[#2C334A] tracking-tight">{MINING_REWARD} <span className="text-lg text-gray-400 font-bold">VA / 24H</span></h3>
        </div>`;
code = code.replace(targetRateBox, "");

code = code.replace(/\{\/\* Ad Modal Simulation \*\/\}[\s\S]*\}\)\}\n    <\/div>/, "    </div>");

code = code.replace(/  const simulateAd = \([\s\S]*?\}, 100\);\n  \};\n/, "");

fs.writeFileSync('src/pages/Earn.tsx', code);
console.log("Earn.tsx updated");
