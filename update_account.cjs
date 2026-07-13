const fs = require('fs');
let code = fs.readFileSync('src/pages/AccountSettings.tsx', 'utf8');

const targetState = `  const [updating, setUpdating] = useState(false);`;
const replacementState = `  const [updating, setUpdating] = useState(false);
  const [showWalletPass, setShowWalletPass] = useState(false);
  const [showAccountPass, setShowAccountPass] = useState(false);
  const [walletPass, setWalletPass] = useState(user?.walletPassword || "");
  const [accountPass, setAccountPass] = useState(user?.accountPassword || "");
  const [savingPass, setSavingPass] = useState(false);

  const savePasswords = async () => {
    if (!user || savingPass) return;
    setSavingPass(true);
    try {
      await updateDoc(doc(db, "users", user.uid), {
        walletPassword: walletPass,
        accountPassword: accountPass
      });
      useAuthStore.getState().updateUser({ walletPassword: walletPass, accountPassword: accountPass });
      alert("Passwords saved!");
    } catch(e) {
      console.error(e);
      alert("Failed to save passwords");
    } finally {
      setSavingPass(false);
    }
  };`;

code = code.replace(targetState, replacementState);
code = code.replace(/import \{ Eye/g, "import { Eye, EyeOff, Key, Save");

const targetEmail = `        {/* Email Address */}`;
const replacementID = `        {/* User ID */}
        <div className="bg-white rounded-2xl p-4 flex items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mr-4 border border-gray-200/50">
            <Hash className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">User ID</p>
            <p className="font-bold text-sm text-gray-900 truncate tracking-wider">{user?.uid || '---'}</p>
          </div>
        </div>
        
        {/* Email Address */}`;

code = code.replace(targetEmail, replacementID);

const targetPass = `        {/* Security Password */}
        <div className="bg-white rounded-2xl p-4 flex items-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center mr-4 border border-amber-200/50">
            <Lock className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Security Password</p>
            <p className="font-bold text-2xl text-amber-500 tracking-[0.2em] -mt-1 leading-none">........</p>
          </div>
          <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors border border-gray-200">
            <Eye className="w-5 h-5" />
          </button>
        </div>`;

const replacementPass = `        {/* Wallet Password */}
        <div className="bg-white rounded-2xl p-4 flex flex-col border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center mr-4 border border-amber-200/50 shrink-0">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Wallet Password</p>
                <div className="flex items-center">
                    <input 
                      type={showWalletPass ? "text" : "password"} 
                      value={walletPass} 
                      onChange={(e) => setWalletPass(e.target.value)}
                      placeholder="Set password for Wallet"
                      className="bg-transparent border-none font-bold text-base text-gray-900 tracking-widest outline-none w-full placeholder-gray-300"
                    />
                </div>
              </div>
              <button onClick={() => setShowWalletPass(!showWalletPass)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors border border-gray-200 shrink-0 ml-2">
                {showWalletPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
          </div>
        </div>

        {/* Account Password */}
        <div className="bg-white rounded-2xl p-4 flex flex-col border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center mr-4 border border-red-200/50 shrink-0">
                <Key className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">ACCOUNT Password</p>
                <div className="flex items-center">
                    <input 
                      type={showAccountPass ? "text" : "password"} 
                      value={accountPass} 
                      onChange={(e) => setAccountPass(e.target.value)}
                      placeholder="Set password for Settings"
                      className="bg-transparent border-none font-bold text-base text-gray-900 tracking-widest outline-none w-full placeholder-gray-300"
                    />
                </div>
              </div>
              <button onClick={() => setShowAccountPass(!showAccountPass)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors border border-gray-200 shrink-0 ml-2">
                {showAccountPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
          </div>
        </div>

        <button onClick={savePasswords} disabled={savingPass} className="w-full bg-[#9333EA] text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center space-x-2 active:scale-95 transition-transform disabled:opacity-50">
           <Save className="w-5 h-5" />
           <span>{savingPass ? "SAVING..." : "SAVE PASSWORDS"}</span>
        </button>`;

code = code.replace(targetPass, replacementPass);
fs.writeFileSync('src/pages/AccountSettings.tsx', code);
console.log("Account Settings updated!");
