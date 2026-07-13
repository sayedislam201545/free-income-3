const fs = require('fs');
let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const targetState = `  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const user = useAuthStore((state) => state.user);`;

const replacementState = `  const [tab, setTab] = useState<'deposit' | 'withdraw' | 'transfer'>('deposit');
  const user = useAuthStore((state) => state.user);
  
  const [isUnlocked, setIsUnlocked] = useState(!user?.walletPassword);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  const handleUnlock = () => {
      if (passInput === user?.walletPassword) {
          setIsUnlocked(true);
      } else {
          setPassError("Incorrect Password");
      }
  };`;

const targetReturn = `  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA] font-sans pb-24">`;

const replacementReturn = `  if (!isUnlocked) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F5F7FA] items-center justify-center p-4 pb-24">
         <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
               <WalletIcon className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Locked</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Please enter your wallet password to continue.</p>
            
            <input 
               type="password" 
               value={passInput}
               onChange={(e) => { setPassInput(e.target.value); setPassError(""); }}
               placeholder="Enter password..."
               className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-2 focus:outline-none focus:border-blue-500 font-bold tracking-widest text-center"
            />
            {passError && <p className="text-red-500 text-xs font-bold w-full text-center mb-4">{passError}</p>}
            
            <button 
               onClick={handleUnlock}
               className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform"
            >
               UNLOCK
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F5F7FA] font-sans pb-24">`;

code = code.replace(targetState, replacementState);
code = code.replace(targetReturn, replacementReturn);

fs.writeFileSync('src/pages/Wallet.tsx', code);
console.log("Wallet updated with password protection");
