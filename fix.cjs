const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(/\/\/ Graph created\n\s*\}\n\s*\}\n\s*\}/g, '// Graph created\n    }');
fs.writeFileSync('index.html', html);
