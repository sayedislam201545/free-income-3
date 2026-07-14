const fs = require('fs');
let content = fs.readFileSync('src/pages/TaskDetail.tsx', 'utf8');

const regex = /const handleAppSubmit = async \(\) => \{[\s\S]*?(?=navigate\(-1\);\n\s*\} catch)/;

const newHandleAppSubmit = `const handleAppSubmit = async () => {
    if (!note || !profileLink) {
      useUIStore.getState().addToast("Please fill all fields.");
      return;
    }
    if (!user || !user.uid) {
      useUIStore.getState().addToast("Please login first.");
      return;
    }
    setIsUploading(true);
    try {
      // Get imgbb API token
      const botSettingSnap = await getDoc(doc(db, "settings", "bot_setting"));
      const imgbbToken = botSettingSnap.exists() ? botSettingSnap.data().imgbbApiToken : null;
      
      if (!imgbbToken) {
        useUIStore.getState().addToast("Imgbb API Token is not configured by admin.");
        setIsUploading(false);
        return;
      }

      const imageUrls: string[] = [];
      for (let i = 0; i < screenshots.length; i++) {
        const file = screenshots[i];
        if (file) {
          const formData = new FormData();
          formData.append("image", file);
          
          try {
            const res = await fetch(\`https://api.imgbb.com/1/upload?key=\${imgbbToken}\`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (data.success) {
              imageUrls.push(data.data.url);
            } else {
              throw new Error("Imgbb upload failed");
            }
          } catch (e) {
             useUIStore.getState().addToast("Failed to upload image to Imgbb.");
             setIsUploading(false);
             return;
          }
        }
      }

      await addDoc(collection(db, "task_submissions"), {
        userId: user.uid,
        username: user.username || user.firstName || 'User',
        taskId: task?.id || "unknown",
        taskTitle: task?.title || "Unknown Task",
        reward: task?.reward || 0,
        note,
        profileLink,
        imageUrls,
        status: "pending",
        createdAt: new Date().toISOString()
      });
      useUIStore.getState().addToast("Submission sent successfully! It is now pending admin approval.");
      `;

content = content.replace(regex, newHandleAppSubmit);

// We need to import `doc` and `getDoc` from firebase if they are not imported
if (!content.includes('getDoc,')) {
    content = content.replace('getDocs,', 'getDocs, getDoc, doc,');
} else if (!content.includes('doc,')) {
    content = content.replace('getDocs,', 'getDocs, doc,');
}

// Remove the import of `ref`, `uploadBytes`, `getDownloadURL` and `storage` if they are causing lint issues, but maybe better not to touch them.

fs.writeFileSync('src/pages/TaskDetail.tsx', content);
