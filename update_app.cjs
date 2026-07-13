const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const requireReferralComponent = `
const RequireReferral = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  if (user && !user.referredBy) {
    return <Navigate to="/refer" replace />;
  }
  return <>{children}</>;
};

export default function App() {`;

code = code.replace("export default function App() {", requireReferralComponent);

code = code.replace('<Route path="/task" element={<Task />} />', '<Route path="/task" element={<RequireReferral><Task /></RequireReferral>} />');
code = code.replace('<Route path="/ads" element={<Ads />} />', '<Route path="/ads" element={<RequireReferral><Ads /></RequireReferral>} />');
code = code.replace('<Route path="/earn" element={<Earn />} />', '<Route path="/earn" element={<RequireReferral><Earn /></RequireReferral>} />');
code = code.replace('<Route path="/spin" element={<Spin />} />', '<Route path="/spin" element={<RequireReferral><Spin /></RequireReferral>} />');
code = code.replace('<Route path="/checkin" element={<CheckIn />} />', '<Route path="/checkin" element={<RequireReferral><CheckIn /></RequireReferral>} />');
code = code.replace('<Route path="/ads/:id" element={<AdDetail />} />', '<Route path="/ads/:id" element={<RequireReferral><AdDetail /></RequireReferral>} />');
code = code.replace('<Route path="/task/:id" element={<TaskDetail />} />', '<Route path="/task/:id" element={<RequireReferral><TaskDetail /></RequireReferral>} />');

fs.writeFileSync('src/App.tsx', code);
console.log("App updated successfully!");
