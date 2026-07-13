const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
code = code.replace("</head>", "    <script src='//libtl.com/sdk.js' data-zone='9955574' data-sdk='show_9955574'></script>\n  </head>");
fs.writeFileSync('index.html', code);
console.log("index.html updated");
