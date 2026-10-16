const fabric = require('fabric').fabric;

const anchor = new fabric.Rect({ left: 0, top: 0, width: 100, height: 100 });
const line = new fabric.Line([-20, -20, 120, 120]);

const group = new fabric.Group([anchor, line], { left: 400, top: 300, originX: 'center', originY: 'center' });

console.log("Anchor originX:", anchor.originX, "originY:", anchor.originY);
console.log("Anchor left:", anchor.left, "top:", anchor.top);
