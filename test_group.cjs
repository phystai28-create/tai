const fabric = require('fabric').fabric;

const anchor = new fabric.Rect({ left: 0, top: 0, width: 100, height: 100 });
const line = new fabric.Line([-20, -20, 120, 120]);

const group = new fabric.Group([anchor, line], { left: 400, top: 300, originX: 'center', originY: 'center' });

console.log("Group width:", group.width, "height:", group.height);
console.log("Anchor left in group:", anchor.left, "top in group:", anchor.top);

// Absolute position of original (0,0):
// original (0,0) is the top-left of anchor.
// The anchor's center is at `anchor.left`, `anchor.top` in the group.
// So the anchor's top-left in the group is `anchor.left - anchor.width/2`, `anchor.top - anchor.height/2`.
// Absolute top-left is:
const absX = group.left + (anchor.left - anchor.width/2);
const absY = group.top + (anchor.top - anchor.height/2);
console.log("Absolute (0,0):", absX, absY);
