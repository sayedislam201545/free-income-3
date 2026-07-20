const fs = require('fs');

let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const functionsToExtract = [
    "AdminLayout",
    "AdminDashboard",
    "AdminTasks",
    "AdminSettings",
    "AdminSubmissions",
    "AdminUsers",
    "AdminAchievements",
    "AdminPayments",
    "AdminRequests",
    "CoinValuesEditor",
    "AdsRewardsEditor",
    "FeatureTogglesEditor"
];

// Let's just use AST parsing or simple block extraction.
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

try {
    const ast = babel.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
    });

    const uniqueFunctions = new Map();
    const imports = [];
    const otherCode = [];

    ast.program.body.forEach(node => {
        if (node.type === 'ImportDeclaration') {
            const raw = code.slice(node.start, node.end);
            if (!imports.includes(raw)) imports.push(raw);
        } else if (node.type === 'ExportDefaultDeclaration' || node.type === 'FunctionDeclaration') {
            let funcName = '';
            if (node.type === 'ExportDefaultDeclaration') {
                funcName = node.declaration.id.name;
            } else {
                funcName = node.id.name;
            }
            if (functionsToExtract.includes(funcName)) {
                if (!uniqueFunctions.has(funcName)) {
                    uniqueFunctions.set(funcName, code.slice(node.start, node.end));
                }
            } else {
                otherCode.push(code.slice(node.start, node.end));
            }
        } else {
            otherCode.push(code.slice(node.start, node.end));
        }
    });

    let newCode = imports.join('\n') + '\n\n' + otherCode.join('\n\n') + '\n\n';
    functionsToExtract.forEach(fn => {
        if (uniqueFunctions.has(fn)) {
            newCode += uniqueFunctions.get(fn) + '\n\n';
        }
    });

    fs.writeFileSync('src/pages/Admin_dedup.tsx', newCode);
    console.log("Successfully deduplicated using Babel!");
} catch (e) {
    console.error("Babel parse failed:", e.message);
}
