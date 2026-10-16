const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldSphere = `    function addSphere() {
      const circle = new fabric.Circle({
        left: 400, top: 300,
        radius: 30,
        originX: 'center', originY: 'center',
        fill: new fabric.Gradient({
          type: 'radial',
          coords: { r1: 0, r2: 30, x1: 10, y1: 10, x2: 30, y2: 30 },
          colorStops: [
            { offset: 0, color: '#ffffff' },
            { offset: 0.8, color: '#94a3b8' },
            { offset: 1, color: '#475569' }
          ]
        }),
        stroke: '#0f172a', strokeWidth: 2,
        strokeUniform: true,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 6, offsetX: 3, offsetY: 3 })
      });
      
      canvas.add(circle);
      canvas.setActiveObject(circle);
    }`;

const newSphere = `    function addSphere() {
      const w = 60;
      const ry = w/4;
      
      const circleFill = new fabric.Circle({
        left: 0, top: 0, radius: w/2,
        fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center'
      });
      
      const circleStroke = new fabric.Circle({
        left: 0, top: 0, radius: w/2,
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center', strokeUniform: true
      });
      
      const frontArc = new fabric.Path(\`M \${-w/2} 0 A \${w/2} \${ry} 0 0 0 \${w/2} 0\`, {
        left: 0, top: ry/2, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center', strokeUniform: true
      });

      const backArc = new fabric.Path(\`M \${-w/2} 0 A \${w/2} \${ry} 0 0 1 \${w/2} 0\`, {
        left: 0, top: -ry/2, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, strokeDashArray: [5,5], originX: 'center', originY: 'center', strokeUniform: true
      });

      const group = new fabric.Group([circleFill, backArc, frontArc, circleStroke], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      
      canvas.add(group);
      canvas.setActiveObject(group);
    }`;

if (html.includes(oldSphere)) {
    html = html.replace(oldSphere, newSphere);
    console.log("Replaced addSphere");
} else {
    console.log("Could not find addSphere");
}

const oldHemisphere = `    function addHemisphere() {
      const w = 100, h = 50, ry = 15;
      
      const bottomFill = new fabric.Ellipse({ 
        left: 0, top: 0, rx: w/2, ry: ry, 
        fill: '#cbd5e1', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const domeFill = new fabric.Path(\`M \${-w/2} 0 A \${w/2} \${h} 0 0 1 \${w/2} 0\`, {
        left: 0, top: -h/2, fill: '#cbd5e1', strokeWidth: 0, originX: 'center', originY: 'center'
      });`;

const newHemisphere = `    function addHemisphere() {
      const w = 100, h = 50, ry = 15;
      
      const bottomFill = new fabric.Ellipse({ 
        left: 0, top: 0, rx: w/2, ry: ry, 
        fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const domeFill = new fabric.Path(\`M \${-w/2} 0 A \${w/2} \${h} 0 0 1 \${w/2} 0\`, {
        left: 0, top: -h/2, fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center'
      });`;

if (html.includes(oldHemisphere)) {
    html = html.replace(oldHemisphere, newHemisphere);
    console.log("Replaced addHemisphere");
} else {
    console.log("Could not find addHemisphere");
}

const oldCyl = `    function addCylinder() {
      const w = 60, h = 100, ry = 15;
      
      const bottomFill = new fabric.Ellipse({ 
        left: 0, top: h/2, rx: w/2, ry: ry, 
        fill: '#cbd5e1', originX: 'center', originY: 'center', strokeWidth: 0 
      });
      
      const bodyFill = new fabric.Rect({ 
        left: 0, top: 0, width: w, height: h, 
        fill: '#cbd5e1', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const topEllipse = new fabric.Ellipse({ 
        left: 0, top: -h/2, rx: w/2, ry: ry, 
        fill: '#f8fafc', stroke: '#0f172a', strokeWidth: 2, 
        originX: 'center', originY: 'center' 
      });`;

const newCyl = `    function addCylinder() {
      const w = 60, h = 100, ry = 15;
      
      const bottomFill = new fabric.Ellipse({ 
        left: 0, top: h/2, rx: w/2, ry: ry, 
        fill: '#ffffff', originX: 'center', originY: 'center', strokeWidth: 0 
      });
      
      const bodyFill = new fabric.Rect({ 
        left: 0, top: 0, width: w, height: h, 
        fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const topEllipse = new fabric.Ellipse({ 
        left: 0, top: -h/2, rx: w/2, ry: ry, 
        fill: '#ffffff', stroke: '#0f172a', strokeWidth: 2, 
        originX: 'center', originY: 'center' 
      });`;

if (html.includes(oldCyl)) {
    html = html.replace(oldCyl, newCyl);
    console.log("Replaced addCylinder");
} else {
    console.log("Could not find addCylinder");
}

fs.writeFileSync('index.html', html);
