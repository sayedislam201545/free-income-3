const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /const handleStatusUpdate = async \(req: any, newStatus: string\) => \{[\s\S]*?\} catch \(error\) \{[\s\S]*?\}\s*\};/;

const newHandler = `const handleStatusUpdate = async (req: any, newStatus: string) => {
    try {
      let rejectReason = "";
      if (newStatus === "rejected") {
        rejectReason = window.prompt("Please enter the reason for rejection:") || "";
        if (!rejectReason) {
          useUIStore.getState().addToast("Rejection reason is required.", "error");
          return;
        }
      }

      const updateData: any = { status: newStatus };
      if (newStatus === "rejected") {
        updateData.rejectReason = rejectReason;
      }

      await updateDoc(doc(db, "transactions", req.id), updateData);
      
      if (req.type === "deposit" && newStatus === "completed" && req.userId) {
        await updateDoc(doc(db, "users", req.userId), {
          vaBalance: increment(Number(req.amount || 0))
        });
      } else if (req.type === "withdraw" && newStatus === "rejected" && req.userId) {
        // Refund the withdrawn amount
        await updateDoc(doc(db, "users", req.userId), {
          vaBalance: increment(Number(req.amount || 0))
        });
      }
      useUIStore.getState().addToast(\`Request \${newStatus}\`, "success");
    } catch (error) {
      useUIStore.getState().addToast("Update failed", "error");
    }
  };`;

code = code.replace(regex, newHandler);
fs.writeFileSync('src/pages/Admin.tsx', code);
console.log("AdminRequests updated.");
