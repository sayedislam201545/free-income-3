const fs = require('fs');
let content = fs.readFileSync('src/pages/Ads.tsx', 'utf8');

// Add state and fetch for adsBoxes
if (!content.includes('const [adsBoxes, setAdsBoxes] = useState')) {
  const targetStr1 = `const [tasks, setTasks] = useState<any[]>(HARDCODED_ADS);`;
  const replaceStr1 = `const [tasks, setTasks] = useState<any[]>(HARDCODED_ADS);
  const [adsBoxes, setAdsBoxes] = useState<any[]>([]);
  const [adsConfig, setAdsConfig] = useState<any>({ dailyAdsLimit: 50 });`;
  content = content.replace(targetStr1, replaceStr1);
}

// Add fetch effect
if (!content.includes('getDoc(doc(db, "settings", "ads_boxes"))')) {
  const targetStr2 = `useEffect(() => {
    const adsRef = collection(db, 'ads');`;
  
  const replaceStr2 = `useEffect(() => {
    const fetchBoxesAndConfig = async () => {
      try {
        const snap = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "settings", "ads_boxes")));
        if (snap.exists()) {
          setAdsBoxes(snap.data().boxes || []);
        }
        
        const configSnap = await import("firebase/firestore").then(m => m.getDoc(m.doc(db, "settings", "ads_config")));
        if (configSnap.exists()) {
            const data = configSnap.data();
            const specificConfig = isVipUser ? data.vipUser : data.normalUser;
            if (specificConfig) {
               setAdsConfig({ ...data, ...specificConfig });
            } else {
               setAdsConfig(data);
            }
        }
      } catch (e) {}
    };
    fetchBoxesAndConfig();
    
    const adsRef = collection(db, 'ads');`;
  
  content = content.replace(targetStr2, replaceStr2);
}

// Replace hardcoded limit with config limit
if (content.includes('const limit = 50;')) {
    content = content.replace('const limit = 50;', 'const limit = adsConfig.dailyAdsLimit || 50;');
}

// Add adsBoxes render block
if (!content.includes('adsBoxes.filter')) {
  const targetStr3 = `<div className="grid grid-cols-3 gap-4 mb-24 px-1">`;
  const replaceStr3 = `
      {adsBoxes.filter(b => b.active && (b.target === "all" || (isVipUser ? b.target === "vip" : b.target === "normal"))).length > 0 && (
        <div className="mb-8 space-y-4 px-1">
           <h3 className="font-bold text-gray-700 text-lg">Promoted Offers</h3>
           {adsBoxes.filter(b => b.active && (b.target === "all" || (isVipUser ? b.target === "vip" : b.target === "normal"))).map(b => (
             <div key={b.id} onClick={() => { if(b.url) window.open(b.url, '_blank') }} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow relative">
                {b.photo && <img src={b.photo} alt={b.title} className="w-full h-32 object-cover" />}
                <div className="p-4">
                  <h4 className="font-bold text-[#2C334A]">{b.title}</h4>
                </div>
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">SPONSORED</div>
             </div>
           ))}
        </div>
      )}
      
      <div className="grid grid-cols-3 gap-4 mb-24 px-1">`;
      
  content = content.replace(targetStr3, replaceStr3);
}

fs.writeFileSync('src/pages/Ads.tsx', content);
console.log("Updated Ads.tsx");
