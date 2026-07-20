const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  const tabs = ['/admin', '/admin/tasks', '/admin/settings', '/admin/submissions', '/admin/users', '/admin/achievements', '/admin/payments'];
  
  for (const tab of tabs) {
     console.log(`\n\nTesting ${tab}...`);
     await page.goto(`http://localhost:3000${tab}`, { waitUntil: 'networkidle2' });
     await new Promise(r => setTimeout(r, 1000));
  }
  
  await browser.close();
})();
