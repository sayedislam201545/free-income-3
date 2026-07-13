const fs = require('fs');
let code = fs.readFileSync('src/pages/AccountSettings.tsx', 'utf8');

const targetState = `  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();`;

const replacementState = `  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  
  const [isUnlocked, setIsUnlocked] = useState(!user?.accountPassword);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState("");

  const handleUnlock = () => {
      if (passInput === user?.accountPassword) {
          setIsUnlocked(true);
      } else {
          setPassError("Incorrect Password");
      }
  };`;

const targetReturn = `  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-md mx-auto w-full relative(100vh-80px)] bg-[#F8F9FE] text-gray-900 -mx-4 -my-6 px-4 py-8 relative overflow-hidden">`;

const replacementReturn = `  if (!isUnlocked) {
    return (
      <div className="flex flex-col min-h-screen bg-[#F8F9FE] items-center justify-center p-4">
         <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl flex flex-col items-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
               <Key className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Settings Locked</h2>
            <p className="text-sm text-gray-500 mb-6 text-center">Please enter your account password.</p>
            
            <input 
               type="password" 
               value={passInput}
               onChange={(e) => { setPassInput(e.target.value); setPassError(""); }}
               placeholder="Enter password..."
               className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 mb-2 focus:outline-none focus:border-red-500 font-bold tracking-widest text-center"
            />
            {passError && <p className="text-red-500 text-xs font-bold w-full text-center mb-4">{passError}</p>}
            
            <button 
               onClick={handleUnlock}
               className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl mt-4 active:scale-95 transition-transform"
            >
               UNLOCK
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] max-w-md mx-auto w-full relative(100vh-80px)] bg-[#F8F9FE] text-gray-900 -mx-4 -my-6 px-4 py-8 relative overflow-hidden">`;

code = code.replace(targetState, replacementState);
code = code.replace(targetReturn, replacementReturn);

fs.writeFileSync('src/pages/AccountSettings.tsx', code);
console.log("Account Settings locked");
