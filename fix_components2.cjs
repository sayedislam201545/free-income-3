const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(/  }, \[\]\);\nfunction AdminUsers/g, '  }, []);\n\n  return <div className="text-white p-6">Admin Submissions Page (Pending restoration)</div>;\n}\n\nfunction AdminUsers');
code = code.replace(/  }, \[\]\);\nfunction AdminAchievements/g, '  }, []);\n\n  return <div className="text-white p-6">Admin Users Page (Pending restoration)</div>;\n}\n\nfunction AdminAchievements');
code = code.replace(/  }, \[\]\);\nfunction AdminPayments/g, '  }, []);\n\n  return <div className="text-white p-6">Admin Achievements Page (Pending restoration)</div>;\n}\n\nfunction AdminPayments');

fs.writeFileSync('src/pages/Admin.tsx', code);
