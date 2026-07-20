const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

function extractFunction(code, name) {
    const startStr = `function ${name}() {`;
    const startIdx = code.indexOf(startStr);
    if (startIdx === -1) return null;
    let braces = 0;
    let idx = startIdx + startStr.length;
    braces++;
    while (braces > 0 && idx < code.length) {
        if (code[idx] === '{') braces++;
        else if (code[idx] === '}') braces--;
        idx++;
    }
    return code.slice(startIdx, idx);
}

const oldCode = extractFunction(code, 'AdminSubmissions');

const newCode = `function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  useEffect(() => {
    const subRef = collection(db, "task_submissions");
    const unsubscribe = onSnapshot(subRef, (snapshot) => {
      if (!snapshot.empty) {
        const subsArray: any[] = [];
        snapshot.forEach((docSnap) => {
          subsArray.push({ id: docSnap.id, ...docSnap.data() });
        });
        setSubmissions(subsArray);
      } else {
        setSubmissions([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string, userId: string, reward: number) => {
    try {
      await updateDoc(doc(db, "task_submissions", id), { status: newStatus });
      if (newStatus === "approved" && userId) {
        const userRef = doc(db, "users", userId.toString());
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          await updateDoc(userRef, { vaBalance: (userData.vaBalance || 0) + reward });
        }
        useUIStore.getState().addToast(\`Submission approved! \${reward} VA rewarded to user.\`);
      } else if (newStatus === "rejected") {
        useUIStore.getState().addToast("Submission rejected.");
      }
    } catch (e) {
      console.error(e);
      useUIStore.getState().addToast("Error updating status.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Task Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-[#151A23] p-4 rounded-xl border border-white/10">
            <p className="font-bold">Task: {sub.taskTitle}</p>
            <p className="text-sm text-gray-400">User ID: {sub.userId}</p>
            {sub.proofUrl && (
              <img src={sub.proofUrl} alt="Proof" className="w-full h-32 object-cover mt-2 rounded" />
            )}
            <div className="mt-4 flex space-x-2">
              <button onClick={() => handleStatusUpdate(sub.id, "approved", sub.userId, sub.reward || 0)} className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500 hover:text-white text-sm">Approve</button>
              <button onClick={() => handleStatusUpdate(sub.id, "rejected", sub.userId, sub.reward || 0)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Reject</button>
            </div>
          </div>
        ))}
        {submissions.length === 0 && <p className="text-gray-400">No submissions found.</p>}
      </div>
    </div>
  );
}`;

code = code.replace(oldCode, newCode);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("Fixed AdminSubmissions!");
