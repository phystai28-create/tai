const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replaceAll('updateTextToolbar', 'updateFloatingToolbar');

fs.writeFileSync('index.html', html);
