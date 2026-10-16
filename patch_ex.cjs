const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  '<button onclick="addFunctionTemplate(\'y\', \'log(x)\')"',
  '<button onclick="addFunctionTemplate(\'y\', \'e^x\')" class="px-1.5 py-0.5 bg-pink-50 text-pink-600 border border-pink-200 rounded text-[10px] hover:bg-pink-100 transition-colors">e^x</button>\n                  <button onclick="addFunctionTemplate(\'y\', \'log(x)\')"'
);

fs.writeFileSync('index.html', html);
