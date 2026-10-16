const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldInclined = /function addInclinedPlane\(\) \{[\s\S]*?canvas\.setActiveObject\(plane\);\s*\}/;

const newInclined = `    function addInclinedPlane() {
      const plane = new fabric.Polygon([
        {x: 0, y: 0},
        {x: 0, y: 150},
        {x: 150, y: 150}
      ], { 
        fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2, 
        left: 400, top: 300, originX: 'center', originY: 'center',
        strokeLineJoin: 'round',
        strokeUniform: true
      });
      canvas.add(plane);
      canvas.setActiveObject(plane);
    }`;

if (html.match(oldInclined)) {
    html = html.replace(oldInclined, newInclined);
    fs.writeFileSync('index.html', html);
    console.log("Fixed Inclined Plane");
} else {
    console.log("Could not find Inclined Plane");
}
