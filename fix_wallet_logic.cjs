const fs = require('fs');
let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const oldLogic = `  const handleDWSubmit = async () => {
    if (!dwAmount || !user?.uid) return;
    const numAmount = parseFloat(dwAmount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (tab === 'withdraw' && (user.vaBalance || 0) < numAmount) {
      showToast("Insufficient balance for withdrawal.", 'error');
      return;
    }`;

const newLogic = `  const handleDWSubmit = async () => {
    if (!dwAmount || !user?.uid) return;
    const numAmount = parseFloat(dwAmount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    if (tab === 'withdraw') {
      if ((user.vaBalance || 0) < numAmount) {
        showToast("Insufficient balance for withdrawal.", 'error');
        return;
      }
      if (adsRewardsSettings.minWithdraw && numAmount < adsRewardsSettings.minWithdraw) {
        showToast(\`Minimum withdraw is \${adsRewardsSettings.minWithdraw} VA\`, 'error');
        return;
      }
      if (adsRewardsSettings.maxWithdraw && numAmount > adsRewardsSettings.maxWithdraw) {
        showToast(\`Maximum withdraw is \${adsRewardsSettings.maxWithdraw} VA\`, 'error');
        return;
      }
      if (adsRewardsSettings.minWithdrawRefer && (user.referralCount || 0) < adsRewardsSettings.minWithdrawRefer) {
        showToast(\`You need at least \${adsRewardsSettings.minWithdrawRefer} referrals to withdraw.\`, 'error');
        return;
      }
    } else if (tab === 'deposit') {
      if (adsRewardsSettings.minDeposit && numAmount < adsRewardsSettings.minDeposit) {
        showToast(\`Minimum deposit is \${adsRewardsSettings.minDeposit} VA\`, 'error');
        return;
      }
      if (adsRewardsSettings.maxDeposit && numAmount > adsRewardsSettings.maxDeposit) {
        showToast(\`Maximum deposit is \${adsRewardsSettings.maxDeposit} VA\`, 'error');
        return;
      }
    }`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('src/pages/Wallet.tsx', code);
