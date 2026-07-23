const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const target = `  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">Task Submissions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="bg-[#151A23] p-4 rounded-xl border border-white/10">`;

const replacement = `  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const filteredSubs = submissions.filter(s => (s.status || "pending") === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Task Submissions</h2>
      </div>
      
      <div className="flex space-x-2">
        {["pending", "approved", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status as any)}
            className={\`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-colors \${activeTab === status ? "bg-white text-[#151A23]" : "bg-white/5 text-gray-400 hover:text-white"}\`}
          >
            {status}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSubs.map((sub) => (
          <div key={sub.id} className="bg-[#151A23] p-4 rounded-xl border border-white/10">
             <div className="flex justify-between items-start">
               <div>
                  <p className="font-bold">{sub.taskTitle || 'Unknown Task'}</p>
                  <p className="text-sm text-gray-400">User ID: {sub.userId}</p>
               </div>
               <span className={\`text-xs px-2 py-1 rounded uppercase font-bold \${sub.status === 'approved' ? 'bg-green-500/20 text-green-500' : sub.status === 'rejected' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'}\`}>
                 {sub.status || 'PENDING'}
               </span>
             </div>`;

code = code.replace(target, replacement);

const buttonTarget = `<div className="mt-4 flex space-x-2">
              <button onClick={() => handleStatusUpdate(sub.id, "approved", sub.userId, sub.reward || 0)} className="px-3 py-1 bg-green-500/20 text-green-400 rounded hover:bg-green-500 hover:text-white text-sm">Approve</button>
              <button onClick={() => handleStatusUpdate(sub.id, "rejected", sub.userId, sub.reward || 0)} className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500 hover:text-white text-sm">Reject</button>
            </div>`;

const buttonReplacement = `{(!sub.status || sub.status === "pending") && (
              <div className="mt-4 flex space-x-2">
                <button onClick={() => handleStatusUpdate(sub.id, "approved", sub.userId, sub.reward || 0)} className="flex-1 py-2 bg-green-500/20 text-green-400 font-bold rounded-lg hover:bg-green-500 hover:text-white text-sm transition-colors">Approve</button>
                <button onClick={() => handleStatusUpdate(sub.id, "rejected", sub.userId, sub.reward || 0)} className="flex-1 py-2 bg-red-500/20 text-red-400 font-bold rounded-lg hover:bg-red-500 hover:text-white text-sm transition-colors">Reject</button>
              </div>
            )}`;

code = code.replace(buttonTarget, buttonReplacement);

const emptyTarget = `{submissions.length === 0 && <p className="text-gray-400">No submissions found.</p>}`;
const emptyReplacement = `{filteredSubs.length === 0 && <p className="text-gray-400 py-8 text-center col-span-full">No {activeTab} submissions found.</p>}`;

code = code.replace(emptyTarget, emptyReplacement);

fs.writeFileSync('src/pages/Admin.tsx', code);
