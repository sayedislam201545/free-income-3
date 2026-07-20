const fs = require('fs');

function injectToggle(file, toggleKey, buttonActionStr, alertMsg) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('useFeatureToggles')) {
    content = 'import { useFeatureToggles } from "../hooks/useFeatureToggles";\n' + content;
    const componentStart = content.indexOf('export default function');
    const hookInject = content.indexOf('{', componentStart) + 1;
    content = content.slice(0, hookInject) + '\n  const featureToggles = useFeatureToggles();\n' + content.slice(hookInject);
  }
  
  // Replace the action
  content = content.replace(buttonActionStr, `if (!featureToggles.${toggleKey}) { useUIStore.getState().addToast("${alertMsg}", "error"); return; }
    ` + buttonActionStr);
    
  fs.writeFileSync(file, content);
}

// 1. CheckIn.tsx
let checkin = fs.readFileSync('src/pages/CheckIn.tsx', 'utf8');
if (!checkin.includes('useFeatureToggles')) {
    checkin = 'import { useFeatureToggles } from "../hooks/useFeatureToggles";\n' + checkin;
    checkin = checkin.replace('export default function CheckIn() {', 'export default function CheckIn() {\n  const featureToggles = useFeatureToggles();');
    checkin = checkin.replace('const handleCheckIn = async () => {', 'const handleCheckIn = async () => {\n    if (!featureToggles.dailyCheckin) { useUIStore.getState().addToast("Daily Check-in is currently disabled by admin", "error"); return; }');
    fs.writeFileSync('src/pages/CheckIn.tsx', checkin);
    console.log('Updated CheckIn');
}

// 2. Spin.tsx
let spin = fs.readFileSync('src/pages/Spin.tsx', 'utf8');
if (!spin.includes('useFeatureToggles')) {
    spin = 'import { useFeatureToggles } from "../hooks/useFeatureToggles";\n' + spin;
    spin = spin.replace('export default function Spin() {', 'export default function Spin() {\n  const featureToggles = useFeatureToggles();');
    spin = spin.replace('const spinWheel = async () => {', 'const spinWheel = async () => {\n    if (!featureToggles.luckyDraw) { useUIStore.getState().addToast("Lucky Draw is currently disabled by admin", "error"); return; }');
    fs.writeFileSync('src/pages/Spin.tsx', spin);
    console.log('Updated Spin');
}

// 3. Wallet.tsx
let wallet = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');
if (!wallet.includes('useFeatureToggles')) {
    wallet = 'import { useFeatureToggles } from "../hooks/useFeatureToggles";\n' + wallet;
    wallet = wallet.replace('export default function Wallet() {', 'export default function Wallet() {\n  const featureToggles = useFeatureToggles();');
    
    wallet = wallet.replace('const handleDeposit = async () => {', 'const handleDeposit = async () => {\n    if (!featureToggles.deposit) { useUIStore.getState().addToast("Deposit is currently disabled by admin", "error"); return; }');
    wallet = wallet.replace('const handleWithdraw = async () => {', 'const handleWithdraw = async () => {\n    if (!featureToggles.withdraw) { useUIStore.getState().addToast("Withdraw is currently disabled by admin", "error"); return; }');
    wallet = wallet.replace('const handleTransfer = async () => {', 'const handleTransfer = async () => {\n    if (!featureToggles.transfer) { useUIStore.getState().addToast("Transfer is currently disabled by admin", "error"); return; }');
    fs.writeFileSync('src/pages/Wallet.tsx', wallet);
    console.log('Updated Wallet');
}

// 4. Auth.tsx
let auth = fs.readFileSync('src/pages/Auth.tsx', 'utf8');
if (!auth.includes('useFeatureToggles')) {
    auth = 'import { useFeatureToggles } from "../hooks/useFeatureToggles";\n' + auth;
    auth = auth.replace('export default function Auth() {', 'export default function Auth() {\n  const featureToggles = useFeatureToggles();');
    auth = auth.replace('const handleEmailAuth = async (e: React.FormEvent) => {', 'const handleEmailAuth = async (e: React.FormEvent) => {\n    if (!isLogin && !featureToggles.registration) { useUIStore.getState().addToast("Registration is currently disabled by admin", "error"); return; }');
    auth = auth.replace('const handleGoogleAuth = async () => {', 'const handleGoogleAuth = async () => {\n    if (!featureToggles.registration) { useUIStore.getState().addToast("Registration is currently disabled by admin", "error"); return; }');
    fs.writeFileSync('src/pages/Auth.tsx', auth);
    console.log('Updated Auth');
}

