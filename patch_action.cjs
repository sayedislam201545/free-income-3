const fs = require('fs');
let code = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

const oldAction = `{/* Action Section based on Category */}
        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3">
          {(category === "joined" || category === "registration") && (
            <button
              onClick={() =>
                window.open(task.targetUrl || "https://t.me", "_blank")
              }
              className="w-full bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(30,58,138)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(30,58,138)]"
            >
              <span>{category === "registration" ? "REGISTRATION NOW" : "JOIN NOW"}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {category === "visit" && (
            isTracking ? (
              <button
                onClick={cancelTracking}
                className="w-full bg-gradient-to-b from-gray-400 to-gray-500 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(107,114,128)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(107,114,128)]"
              >
                <span>⏳ PLEASE WAIT... {timeRemaining}S</span>
              </button>
            ) : (
              <button
                onClick={handleStartVisit}
                className="w-full bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(30,58,138)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(30,58,138)]"
              >
                <span>START VISITING</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )
          )}

          {(category === "registration" || category === "vip") &&
            !showSubmitForm && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="w-full bg-gradient-to-b from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-[0_6px_0_rgb(21,128,61)] flex items-center justify-center space-x-2 transition-transform active:translate-y-[6px] active:shadow-[0_0px_0_rgb(21,128,61)]"
              >
                <span>SUBMIT PROOF</span>
                <Send className="w-4 h-4" />
              </button>
            )}
        </div>`;

const newAction = `{/* Action Section based on Category */}
        <div className="bg-white rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4 p-2">
          {(category === "joined" || category === "registration") && (
            <button
              onClick={() =>
                window.open(task.targetUrl || "https://t.me", "_blank")
              }
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
            >
              <span>{category === "registration" ? "REGISTRATION NOW" : "JOIN NOW"}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          )}

          {category === "visit" && (
            isTracking ? (
              <button
                onClick={cancelTracking}
                className="w-full bg-gradient-to-r from-gray-400 to-gray-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>⏳ PLEASE WAIT... {timeRemaining}S</span>
              </button>
            ) : (
              <button
                onClick={handleStartVisit}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>START VISITING</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )
          )}

          {(category === "registration" || category === "vip") &&
            !showSubmitForm && (
              <button
                onClick={() => setShowSubmitForm(true)}
                className="w-full mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-sm tracking-wide shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-transform"
              >
                <span>SUBMIT PROOF</span>
                <Send className="w-4 h-4" />
              </button>
            )}
        </div>`;

const lines = code.split(oldAction);
if (lines.length > 1) {
    fs.writeFileSync('src/pages/TaskDetail.tsx', lines.join(newAction));
} else {
    // maybe duplicated comment
    const fallbackLines = code.split('{/* Action Section based on Category */}\n        {/* Action Section based on Category */}\n        <div className="animate-in fade-in slide-in-from-bottom-4 space-y-3">');
    if(fallbackLines.length > 1) {
        // Just write a custom replace
    }
}
