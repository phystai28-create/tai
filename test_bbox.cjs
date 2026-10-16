const fabric = require('fabric').fabric;

const objs = [];
// simulate a bounding box of 400x400
objs.push(new fabric.Rect({ left: 0, top: 0, width: 400, height: 400, fill: 'transparent' }));

// simulate e^x going out of bounds
const pathStr = "M 0 200 L 100 100 L 200 -10000 L 300 -50000";
objs.push(new fabric.Path(pathStr, { fill: 'transparent', stroke: 'red' }));

const group = new fabric.Group(objs, {
    left: 400, top: 300, originX: 'center', originY: 'center'
});
console.log("Group bounding box:", group.width, group.height);
console.log("Group top/left:", group.top, group.left);
