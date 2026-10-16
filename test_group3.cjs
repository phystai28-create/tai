const fabric = require('fabric').fabric;

const anchor = new fabric.Rect({ left: 0, top: 0, width: 100, height: 100 });
const p = new fabric.Rect({ left: 20, top: 30, width: 10, height: 10 });
const line = new fabric.Line([-20, -20, 120, 120]);

const group = new fabric.Group([anchor, p, line], { left: 400, top: 300, originX: 'center', originY: 'center' });

const absZeroX = group.left + anchor.left;
const absZeroY = group.top + anchor.top;

console.log("Expected p absolute left:", 400 + anchor.left + 20);
console.log("Expected p absolute top:", 300 + anchor.top + 30);
console.log("Actual p absolute left:", group.left + p.left);
console.log("Actual p absolute top:", group.top + p.top);
