const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// AdminSubmissions
code = code.replace('    return () => unsubscribe();\n  }, []);\nfunction AdminUsers', '    return () => unsubscribe();\n  }, []);\n\n  return <div className="text-white p-6">Admin Submissions Page (Pending restoration)</div>;\n}\n\nfunction AdminUsers');

// AdminUsers
code = code.replace('    return () => unsub();\n  }, []);\nfunction AdminAchievements', '    return () => unsub();\n  }, []);\n\n  return <div className="text-white p-6">Admin Users Page (Pending restoration)</div>;\n}\n\nfunction AdminAchievements');

// AdminAchievements
code = code.replace('    return () => unsub();\n  }, []);\nfunction AdminPayments', '    return () => unsub();\n  }, []);\n\n  return <div className="text-white p-6">Admin Achievements Page (Pending restoration)</div>;\n}\n\nfunction AdminPayments');

fs.writeFileSync('src/pages/Admin.tsx', code);
