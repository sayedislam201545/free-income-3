const fs = require('fs');
const blocks = {
  dash: fs.readFileSync('extracted_safe.json', 'utf8').split('","')[0],
  sub: fs.readFileSync('extracted_safe.json', 'utf8').split('","')[1],
  settings: fs.readFileSync('extracted_safe.json', 'utf8').split('","')[2],
  vip: fs.readFileSync('extracted_safe.json', 'utf8').split('","')[3],
  tasks: fs.readFileSync('tasks.txt', 'utf8'),
  achieve: fs.readFileSync('achieve.txt', 'utf8'),
  payments: fs.readFileSync('payments.txt', 'utf8'),
  reqs: fs.readFileSync('reqs_backup.txt', 'utf8')
};

for (const [name, code] of Object.entries(blocks)) {
   let open = (code.match(/{/g)||[]).length;
   let close = (code.match(/}/g)||[]).length;
   console.log(`${name}: Open: ${open}, Close: ${close}`);
}
