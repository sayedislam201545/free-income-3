const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const pdfFunc = `
  const generateAdminPDF = async () => {
    try {
      const { jsPDF } = await import("jspdf");
      const docPdf = new jsPDF();
      docPdf.setFontSize(22);
      docPdf.text("Admin System Activity Summary", 20, 20);
      
      docPdf.setFontSize(14);
      docPdf.text("Generated on: " + new Date().toLocaleString(), 20, 30);
      
      docPdf.setFontSize(12);
      let yPos = 50;
      
      const usersSnap = await getDocs(collection(db, "users"));
      const tasksSnap = await getDocs(collection(db, "tasks"));
      const txSnap = await getDocs(collection(db, "transactions"));
      
      docPdf.text(\`Total Users: \${usersSnap.size}\`, 20, yPos);
      yPos += 10;
      docPdf.text(\`Total Tasks: \${tasksSnap.size}\`, 20, yPos);
      yPos += 10;
      docPdf.text(\`Total Transactions: \${txSnap.size}\`, 20, yPos);
      yPos += 20;
      
      docPdf.text("Recent Transactions (Last 5):", 20, yPos);
      yPos += 10;
      
      const recentTx = txSnap.docs
        .map(d => d.data())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 5);
        
      recentTx.forEach((tx, index) => {
         docPdf.text(\`\${index + 1}. [\${tx.type || 'Unknown'}] Amount: \${tx.amount || 0} Status: \${tx.status || 'N/A'}\`, 20, yPos);
         yPos += 10;
      });
      
      docPdf.save(\`Admin_Activity_Summary_\${new Date().getTime()}.pdf\`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      useUIStore.getState().addToast("Failed to generate PDF");
    }
  };
`;

code = code.replace(
  'function AdminSettings() {',
  'function AdminSettings() {\n' + pdfFunc
);

// We need to make sure the PDF button is there.
const pdfButton = `
          <button onClick={generateAdminPDF} className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg text-sm font-bold transition-colors">
            Export PDF Report
          </button>
`;

code = code.replace(
  '<h2 className="text-xl font-bold">Admin Settings & Configuration</h2>',
  '<h2 className="text-xl font-bold">Admin Settings & Configuration</h2>\n' + pdfButton
);

fs.writeFileSync('src/pages/Admin.tsx', code);
