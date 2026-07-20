const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regex = /\} from "react";\nimport \{ Routes/g;
let match;
while ((match = regex.exec(code)) !== null) {
  console.log("Found at index:", match.index);
}
