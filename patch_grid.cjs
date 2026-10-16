const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(/stroke: '#94a3b8', strokeWidth: 1\.5, strokeDashArray: \[4, 4\] \}\)\);/g, 
  "stroke: '#64748b', strokeWidth: 2, strokeDashArray: [4, 4] }));");

fs.writeFileSync('index.html', html);
