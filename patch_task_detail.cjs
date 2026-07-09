const fs = require('fs');
let code = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

const replacement = `
      {/* Header Area */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-b-[40px] z-0 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-8 w-4 h-4 bg-white/30 rotate-45" />
        <div className="absolute top-12 right-20 w-2 h-2 bg-white/20 rotate-45" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      </div>

      <header className="flex items-center mb-6 pt-4 px-2 relative z-10">
        <PremiumBackButton fallbackPath="/task" className="scale-90 origin-left mr-3" theme="dark" />
        <h1 className="text-2xl font-bold text-white tracking-tight">Task Details</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-20 space-y-6 relative z-10 px-2">
        <div className="bg-white rounded-[24px] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
          
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-black text-[#1E2330] leading-tight max-w-[65%]">{task.title}</h2>
            <button
              onClick={() => window.open(task.youtubeUrl || "https://youtube.com", "_blank")}
              className="flex items-center space-x-1.5 bg-red-50 text-red-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-100 shadow-sm active:scale-95 transition-transform shrink-0"
            >
              <Video className="w-4 h-4" />
              <span className="uppercase tracking-wide">Tutorial</span>
            </button>
          </div>

          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl mb-6 shadow-sm">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">🪙</div>
            <span className="text-indigo-600 font-bold text-sm tracking-tight">+{task.reward} <span className="text-xs font-medium text-gray-500">Coins</span></span>
          </div>

          <div className="bg-[#F4F4FA] border-l-4 border-indigo-500 rounded-r-xl rounded-l-sm p-4 mb-2">
            <div className="flex items-center space-x-2 mb-2">
               <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
               <h3 className="font-bold text-xs text-indigo-700 uppercase tracking-wide">
                 Instructions
               </h3>
            </div>
            <p className="text-sm text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
              {task.description ||
                "Follow the instructions to complete this task and earn your reward. Make sure to complete all steps accurately to receive coins."}
            </p>
          </div>
        </div>

        {/* Action Section based on Category */}
`;

// we need to replace the section starting from {/* Header */} to {/* Action Section based on Category */}
const startIdx = code.indexOf('{/* Header */}');
const endIdx = code.indexOf('{/* Action Section based on Category */}');

if (startIdx !== -1 && endIdx !== -1) {
    const originalPart = code.substring(startIdx, endIdx + '{/* Action Section based on Category */}'.length);
    code = code.replace(originalPart, replacement.trim() + '\n        {/* Action Section based on Category */}');
    fs.writeFileSync('src/pages/TaskDetail.tsx', code);
} else {
    console.log("Could not find start/end comments.");
}

