const fs = require('fs');
let code = fs.readFileSync('src/components/PremiumBackButton.tsx', 'utf8');

const target = `  const handleBack = () => {
    playPremiumClick();
    setTimeout(() => {
      if (window.history.length > 1 && window.history.state?.idx > 0) {
        navigate(-1);
      } else {
        navigate(fallbackPath, { replace: true });
      }
    }, 150);
  };`;

const replacement = `  const handleBack = () => {
    playPremiumClick();
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath, { replace: true });
    }
  };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/PremiumBackButton.tsx', code);
console.log("PremiumBackButton updated");
