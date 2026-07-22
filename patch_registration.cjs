const fs = require('fs');
let code = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

// 1. Replace Screenshot block + Form with new Form
const formRegex = /<div className="mb-4">\s*<label className="block text-xs font-bold text-gray-600 mb-1">\s*Upload Screenshots[\s\S]*?<button[\s\S]*?Submit to Admin[\s\S]*?<\/button>/;

const newForm = `<div className="mb-4 space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">User Name</label>
                <input type="text" value={user?.username || user?.firstName || "Unknown User"} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">User ID</label>
                <input type="text" value={user?.telegramId || user?.uid || ""} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Task ID</label>
                <input type="text" value={task?.id || ""} disabled className="w-full bg-gray-100 border border-gray-200 rounded-xl p-3 text-sm text-gray-500 cursor-not-allowed" />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Profile Link
              </label>
              <input
                type="url"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-600 mb-1">
                Note / Task details
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Write your note here..."
              />
            </div>

            <button
              disabled={isUploading}
              onClick={handleAppSubmit}
              className={\`w-full py-4 \${isUploading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700 active:scale-95'} text-white rounded-xl font-bold shadow-md transition-all\`}
            >
              {isUploading ? 'Submitting...' : 'Submit to Admin'}
            </button>`;

code = code.replace(formRegex, newForm);

// 2. Update handleAppSubmit
const submitRegex = /const handleAppSubmit = async \(\) => {[\s\S]*?useUIStore\.getState\(\)\.addToast\("Proof submitted successfully!"\);\s*setStep\("visit"\);\s*\}\s*catch[^{]*\{[\s\S]*?\}\s*\}/;

const newSubmit = `const handleAppSubmit = async () => {
    if (!note || !profileLink) {
      useUIStore.getState().addToast("Please fill Profile Link and Note.");
      return;
    }
    if (!user || (!user.uid && !user.telegramId)) {
      useUIStore.getState().addToast("Please login first.");
      return;
    }
    setIsUploading(true);
    try {
      await addDoc(collection(db, "task_submissions"), {
        userId: user.uid,
        username: user.username || user.firstName || 'User',
        telegramId: user.telegramId || '',
        taskId: task?.id || "unknown",
        taskTitle: task?.title || "Unknown Task",
        reward: task?.reward || 0,
        note,
        profileLink,
        imageUrls: [],
        status: "pending",
        createdAt: new Date().toISOString()
      });

      // Get bot setting to find developer whatsapp/telegram or default admin link
      const botSettingSnap = await getDoc(doc(db, "settings", "bot_setting"));
      let adminUsername = "admin";
      if (botSettingSnap.exists() && botSettingSnap.data().botUsername) {
         adminUsername = botSettingSnap.data().botUsername.replace('@', '');
      }

      const tgMessage = \`Task Submission:
Task ID: \${task?.id}
Task Name: \${task?.title}
User ID: \${user?.telegramId || user?.uid}
User Name: \${user?.username || user?.firstName}
Profile Link: \${profileLink}
Note: \${note}

বি:দ্র: Upload Screenshots\`;
      
      const tgLink = \`https://t.me/\${adminUsername}?text=\${encodeURIComponent(tgMessage)}\`;
      
      useUIStore.getState().addToast("Proof submitted successfully!");
      setStep("visit");
      setTimeout(() => {
         window.open(tgLink, "_blank");
      }, 500);
      
    } catch (e) {
      useUIStore.getState().addToast("Error submitting proof.", "error");
    } finally {
      setIsUploading(false);
    }
  }`;

code = code.replace(submitRegex, newSubmit);

fs.writeFileSync('src/pages/TaskDetail.tsx', code);
console.log("Registration task patched.");
