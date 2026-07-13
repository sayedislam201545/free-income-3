const fs = require('fs');
let code = fs.readFileSync('src/pages/Refer.tsx', 'utf8');

const targetState = `  const [copiedCode, setCopiedCode] = useState(false);`;
const replacementState = `  const [copiedCode, setCopiedCode] = useState(false);
  const [actualReferrals, setActualReferrals] = useState(0);
  const [actualEarnings, setActualEarnings] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchReferrals = async () => {
      try {
        const { collection, query, where, getDocs } = await import("firebase/firestore");
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("referredBy", "==", user.uid));
        const snap = await getDocs(q);
        setActualReferrals(snap.size);
        
        let earnings = 0;
        // In this simple version we assume standard reward for past ones or we use a fixed multiplier
        // Or if we stored the exact earned, we would use it, but since we didn't, we just multiply
        // A better way is using the current user's isVip logic.
        const reward = (user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now()) ? 275 : 250;
        setActualEarnings(snap.size * reward);
      } catch (e) {
        console.error(e);
      }
    };
    fetchReferrals();
  }, [user]);`;

code = code.replace(targetState, replacementState);

code = code.replace(/\{user\?.referralCount \|\| 0\}/g, "{actualReferrals}");
code = code.replace(/\{\(user\?.referralCount \|\| 0\) \* rewardAmount\}/g, "{actualEarnings}");

fs.writeFileSync('src/pages/Refer.tsx', code);
console.log("Refer.tsx updated for dynamic referral count!");
