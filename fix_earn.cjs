const fs = require('fs');
let code = fs.readFileSync('src/pages/Earn.tsx', 'utf8');

// Find where MINING_REWARD is defined
// const MINING_REWARD = 500;
// We need to fetch it from ads_rewards_config, or use a state
code = code.replace(/const MINING_REWARD = 500;/g, 'const [MINING_REWARD, setMiningReward] = useState(500);');

const effectRegex = /useEffect\(\(\) => \{\n    if \(\!user\) return;\n    const fetchMiningState = async \(\) => \{/;

const newEffect = `useEffect(() => {
    if (!user) return;
    const fetchMiningState = async () => {
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const configSnap = await getDoc(doc(db, "settings", "ads_rewards_config"));
        if (configSnap.exists()) {
           const rate = configSnap.data()?.settings?.miningRate;
           if (rate) setMiningReward(rate);
        }
      } catch (e) {}
`;

code = code.replace(effectRegex, newEffect);

fs.writeFileSync('src/pages/Earn.tsx', code);
