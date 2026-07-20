const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace('import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";', 'import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";\nimport { ErrorBoundary } from "./components/ErrorBoundary";');
code = code.replace('<Routes>', '<ErrorBoundary><Routes>');
code = code.replace('</Routes>', '</Routes></ErrorBoundary>');
fs.writeFileSync('src/App.tsx', code);
