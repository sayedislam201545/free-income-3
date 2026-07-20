const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const str = 'import { Routes, Route, Link } from "react-router-dom";';
const first = code.indexOf(str);
const second = code.indexOf(str, first + 10);
if (second !== -1) {
    // The garbage starts right before the second import!
    console.log("Garbage starts around:", second);
    // Let's print the 50 chars before it
    console.log(code.substring(second - 50, second + 50));
}
