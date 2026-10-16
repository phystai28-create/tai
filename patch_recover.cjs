const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const addFuncTemplateScript = `
    function addFunctionTemplate(type, expr) {
        addGraphFunction();
        const rows = document.querySelectorAll('#graph-functions-list > div');
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            lastRow.querySelector('.func-type').value = type;
            lastRow.querySelector('.func-input').value = expr;
        }
    }
`;

if (!html.includes('function addFunctionTemplate')) {
    html = html.replace('function addGraphFunction() {', addFuncTemplateScript + '\n    function addGraphFunction() {');
}

fs.writeFileSync('index.html', html);
