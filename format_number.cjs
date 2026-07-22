const formatShortNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 10000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return num?.toFixed(2) || '0.00';
};
console.log(formatShortNumber(12000));
console.log(formatShortNumber(1000000));
console.log(formatShortNumber(100));
