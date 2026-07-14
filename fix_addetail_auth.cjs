const fs = require('fs');
let content = fs.readFileSync('src/pages/AdDetail.tsx', 'utf8');

// We need to import useAuthStore if not imported, but it might not be.
if (!content.includes('import { useAuthStore } from "../store/useAuthStore";')) {
  content = content.replace('import { useAdTracker } from "../hooks/useAdTracker";', 'import { useAdTracker } from "../hooks/useAdTracker";\nimport { useAuthStore } from "../store/useAuthStore";');
}

const targetStr = `const isVipUser = auth.currentUser ? auth.currentUser.isVip : false;`;
const newStr = `const user = useAuthStore((state) => state.user);
  const isVipUser = user?.isVip && user?.vipExpiry && user?.vipExpiry > Date.now();`;

content = content.replace(targetStr, newStr);

fs.writeFileSync('src/pages/AdDetail.tsx', content);
console.log("Fixed AdDetail VIP User check");
