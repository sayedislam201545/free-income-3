const fs = require('fs');
let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

// I need to completely replace from 'const calculateValue =' down to 'return (' just above it.
// Actually, let's find the position.

const regex = /const calculateValue = \([\s\S]*?return \(/;

const newCode = `const calculateValue = (coins: string, method: any) => {
    const num = parseFloat(coins);
    if (isNaN(num) || num <= 0) return { value: '0.00', symbol: method?.isCrypto ? '$' : '৳', currency: method?.isCrypto ? 'USD' : 'BDT' };
    
    const bdtRate = coinRates?.bdtRate || coinRates?.bKash || 1;
    const cryptoRate = coinRates?.cryptoRate || 1;

    if (method?.isCrypto) {
       return { value: (num * cryptoRate).toFixed(2), symbol: '$', currency: 'USD' };
    } else {
       return { value: (num * bdtRate).toFixed(2), symbol: '৳', currency: 'BDT' };
    }
  };

  return (`;

code = code.replace(regex, newCode);

const renderOld1 = /{calculateValue\(dwAmount, selectedMethod\.id\)} <span className="text-\[10px\]">{selectedMethod\.name === 'Bkash' \|\| selectedMethod\.name === 'Nagad' \|\| selectedMethod\.name === 'Roket' \? 'BDT' : selectedMethod\.name}<\/span>/g;
const renderNew1 = `{calculateValue(dwAmount, selectedMethod).symbol}{calculateValue(dwAmount, selectedMethod).value} <span className="text-[10px]">{calculateValue(dwAmount, selectedMethod).currency}</span>`;

code = code.replace(renderOld1, renderNew1);

const fiatAmountRegex = /fiatAmount: calculateValue\(dwAmount, selectedMethod\.id\)/g;
const fiatAmountNew = `fiatAmount: calculateValue(dwAmount, selectedMethod).value`;
code = code.replace(fiatAmountRegex, fiatAmountNew);

fs.writeFileSync('src/pages/Wallet.tsx', code);
