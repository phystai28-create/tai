const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('        </div>\n\n        </div>\n\n        <div class="mt-auto', '        </div>\n\n        <div class="mt-auto');

fs.writeFileSync('index.html', html);
console.log("Done");
