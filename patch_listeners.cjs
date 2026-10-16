const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const old1 = `canvas.on('object:moving', (e) => { if(e.target && (e.target.type === 'i-text' || e.target.type === 'text')) updateFloatingToolbar(); });`;
const new1 = `canvas.on('object:moving', (e) => { if(e.target) updateFloatingToolbar(); });`;

const old2 = `canvas.on('object:scaling', (e) => { if(e.target && (e.target.type === 'i-text' || e.target.type === 'text')) updateFloatingToolbar(); });`;
const new2 = `canvas.on('object:scaling', (e) => { if(e.target) updateFloatingToolbar(); });`;

if (html.includes(old1)) {
    html = html.replace(old1, new1);
}
if (html.includes(old2)) {
    html = html.replace(old2, new2);
}

fs.writeFileSync('index.html', html);
