const fs = require('fs');
let code = fs.readFileSync('src/pages/Wallet.tsx', 'utf8');

const calculateValueRegex = /const calculateValue = \([\s\S]*?\};/;
const newCalculateValue = `const calculateValue = (coins: string, method: any) => {
    const num = parseFloat(coins);
    if (isNaN(num) || num <= 0) return { value: '0.00', symbol: method?.isCrypto ? '$' : '৳', currency: method?.isCrypto ? 'USD' : 'BDT' };
    
    const bdtRate = coinRates?.bdtRate || coinRates?.bKash || 1;
    const cryptoRate = coinRates?.cryptoRate || 1;

    if (method?.isCrypto) {
       return { value: (num * cryptoRate).toFixed(2), symbol: '$', currency: 'USD' };
    } else {
       return { value: (num * bdtRate).toFixed(2), symbol: '৳', currency: 'BDT' };
    }
  };`;

code = code.replace(calculateValueRegex, newCalculateValue);

// Now find and replace the rendering part
const renderRegex = /\{calculateValue\(dwAmount, selectedMethod\.id\)\} <span className="text-\[10px\]">\{selectedMethod\.name === 'Bkash' \|\| selectedMethod\.name === 'Nagad' \|\| selectedMethod\.name === 'Roket' \? 'BDT' : selectedMethod\.name\}<\/span>/;

const newRender = `{calculateValue(dwAmount, selectedMethod).symbol}{calculateValue(dwAmount, selectedMethod).value} <span className="text-[10px]">{calculateValue(dwAmount, selectedMethod).currency}</span>`;

code = code.replace(renderRegex, newRender);

fs.writeFileSync('src/pages/Wallet.tsx', code);
