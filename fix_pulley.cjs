const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function addPulley\(\) \{[\s\S]*?canvas\.setActiveObject\(group\);\s*\}/;
const replacement = `    function addPulley() {
      const ceiling = new fabric.Rect({ left: -60, top: -50, width: 120, height: 10, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const mount = new fabric.Rect({ left: -8, top: -40, width: 16, height: 45, fill: '#e2e8f0', stroke: '#475569', strokeWidth: 2 });
      const stringL = new fabric.Line([-30, 0, -30, 120], { stroke: '#000000', strokeWidth: 3 });
      const stringR = new fabric.Line([30, 0, 30, 120], { stroke: '#000000', strokeWidth: 3 });
      const stringArc = new fabric.Path('M -30 0 A 30 30 0 0 1 30 0', { fill: 'transparent', stroke: '#000000', strokeWidth: 3 });
      const wheel = new fabric.Circle({ radius: 30, fill: '#94a3b8', stroke: '#475569', strokeWidth: 3, left: -30, top: -30 });
      const dot = new fabric.Circle({ radius: 4, fill: '#0f172a', left: -4, top: -4 });
      
      const group = new fabric.Group([stringL, stringR, stringArc, wheel, mount, dot, ceiling], { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(group);
      canvas.setActiveObject(group);
    }`;

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html);
    console.log("Fixed addPulley");
} else {
    console.log("Could not find addPulley");
}
