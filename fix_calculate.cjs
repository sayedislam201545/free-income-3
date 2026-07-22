const fs = require('fs');
let lines = fs.readFileSync('src/pages/Wallet.tsx', 'utf8').split('\n');

let start = -1;
for (let i = 0; i < lines.length; i++) {
   if (lines[i].includes('const calculateValue = (coins: string, method: any) => {')) {
       start = i;
       break;
   }
}

if (start !== -1) {
   lines.splice(start, 3, 
`  const calculateValue = (coins: string, method: any) => {
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

  return (`
   );
}

fs.writeFileSync('src/pages/Wallet.tsx', lines.join('\n'));
