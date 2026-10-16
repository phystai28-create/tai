const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function addCuboid\(isCube\) \{[\s\S]*?canvas\.setActiveObject\(group\);\s*\}/;

const newCuboid = `    function addCuboid(isCube) {
      const w = isCube ? 60 : 100;
      const h = isCube ? 60 : 50;
      const dx = isCube ? 25 : 30;
      const dy = isCube ? -25 : -20;
      
      const opts = { stroke: '#333333', strokeWidth: 2, strokeUniform: true, strokeLineCap: 'round', strokeLineJoin: 'round' };
      const dashOpts = { ...opts, strokeDashArray: [5, 5] };
      
      const backTop = new fabric.Line([dx, dy, dx + w, dy], opts);
      const backRight = new fabric.Line([dx + w, dy, dx + w, dy + h], opts);
      const backBottom = new fabric.Line([dx, dy + h, dx + w, dy + h], dashOpts);
      const backLeft = new fabric.Line([dx, dy, dx, dy + h], dashOpts);
      
      const connTL = new fabric.Line([0, 0, dx, dy], opts);
      const connTR = new fabric.Line([w, 0, dx + w, dy], opts);
      const connBR = new fabric.Line([w, h, dx + w, dy + h], opts);
      const connBL = new fabric.Line([0, h, dx, dy + h], dashOpts);

      const front = new fabric.Rect({ left: 0, top: 0, width: w, height: h, fill: 'transparent', ...opts, originX: 'left', originY: 'top' });

      const group = new fabric.Group([
        backBottom, backLeft, backTop, backRight, 
        connBL, connTL, connTR, connBR, 
        front
      ], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      
      canvas.add(group);
      canvas.setActiveObject(group);
    }`;

html = html.replace(regex, newCuboid);
fs.writeFileSync('index.html', html);
console.log("Fixed Cuboid Dots");
