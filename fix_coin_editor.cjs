const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const editorCode = `
function CoinValuesEditor({ onClose, onSave, initialValues }: any) {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");
  const [methods, setMethods] = useState<any>({ deposit: [], withdraw: [] });
  const [values, setValues] = useState<any>(initialValues || {});

  useEffect(() => {
    const fetchMethods = async () => {
      const docRef = doc(db, "settings", "payment_methods");
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setMethods(snap.data());
      }
    };
    fetchMethods();
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center space-x-3 mb-6">
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold">Edit Coin Values</h2>
      </div>
      <p className="text-sm text-gray-400 mb-6">
        Set the value of 1 VA coin for different methods. Methods are dynamically pulled from your Payment Methods.
      </p>

      <div className="flex space-x-2 bg-[#1C2331] p-1.5 rounded-xl mb-6">
        <button
          onClick={() => setActiveTab("deposit")}
          className={\`flex-1 py-2 rounded-lg font-bold transition-all \${activeTab === "deposit" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Deposit Methods
        </button>
        <button
          onClick={() => setActiveTab("withdraw")}
          className={\`flex-1 py-2 rounded-lg font-bold transition-all \${activeTab === "withdraw" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-white hover:bg-white/5"}\`}
        >
          Withdraw Methods
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(methods[activeTab] || []).map((method: any) => (
          <div
            key={method.id}
            className="bg-[#151A23] border border-white/5 rounded-xl p-4 flex items-center justify-between"
          >
            <span className="font-bold text-white flex items-center space-x-2">
               {method.photo && <img src={method.photo} className="w-6 h-6 rounded-full object-cover" />}
               <span>{method.name}</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">1 VA =</span>
              <input
                type="number"
                step="any"
                value={values[method.name] || ""}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [method.name]: parseFloat(e.target.value) || 0,
                  })
                }
                className="bg-[#0B0E14] border border-white/10 rounded-lg px-3 py-1.5 text-white w-24 focus:outline-none"
              />
            </div>
          </div>
        ))}
        {(methods[activeTab] || []).length === 0 && (
           <div className="col-span-full py-8 text-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
             No {activeTab} methods found. Add them in the Resources section first.
           </div>
        )}
      </div>

      <button onClick={() => onSave(values)} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg mt-6">
        Save Changes
      </button>
    </div>
  );
}
`;

content = content + '\n' + editorCode;

fs.writeFileSync('src/pages/Admin.tsx', content);
