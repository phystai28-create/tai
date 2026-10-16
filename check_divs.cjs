const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
let asideStart = html.indexOf('<aside');
let asideEnd = html.indexOf('</aside>') + 8;
let asideStr = html.substring(asideStart, asideEnd);

let openCount = (asideStr.match(/<div/g) || []).length;
let closeCount = (asideStr.match(/<\/div>/g) || []).length;
console.log('Open:', openCount, 'Close:', closeCount);

let count = 0;
let lines = asideStr.split('\n');
for(let i = 0; i < lines.length; i++) {
  let o = (lines[i].match(/<div/g) || []).length;
  let c = (lines[i].match(/<\/div>/g) || []).length;
  count += o - c;
  if(count < 0) {
    console.log('Negative count at line', i, lines[i]);
  }
}
