const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const toolsCode = `
    // ===== THERMODYNAMICS OBJECTS =====
    
    function addThermometer() {
      const x = (canvas.width || 800) / 2;
      const y = (canvas.height || 600) / 2;
      const w = 12;
      const h = 120;
      
      const glassBody = new fabric.Rect({
        left: 0, top: -h/2, width: w, height: h,
        fill: '#f8fafc', stroke: '#94a3b8', strokeWidth: 1.5,
        originX: 'center', originY: 'center', rx: w/2, ry: w/2
      });
      
      const bulb = new fabric.Circle({
        left: 0, top: h/2, radius: 12,
        fill: '#ef4444', stroke: '#94a3b8', strokeWidth: 1.5,
        originX: 'center', originY: 'center'
      });
      
      const liquidBody = new fabric.Rect({
        left: 0, top: h/4, width: w/2, height: h/2 + 5,
        fill: '#ef4444', stroke: 'transparent',
        originX: 'center', originY: 'center'
      });
      
      const marks = [];
      for (let i = -h/2 + 10; i < h/2 - 10; i += 10) {
        marks.push(new fabric.Line([-w/2, i, 0, i], {
          stroke: '#64748b', strokeWidth: 1, originX: 'center', originY: 'center'
        }));
      }
      
      const thermometer = new fabric.Group([glassBody, bulb, liquidBody, ...marks], {
        left: x, top: y, originX: 'center', originY: 'center'
      });
      
      canvas.add(thermometer);
      canvas.setActiveObject(thermometer);
      canvas.renderAll();
    }
    
    function addAlcoholLamp() {
      const x = (canvas.width || 800) / 2;
      const y = (canvas.height || 600) / 2;
      
      const body = new fabric.Path('M -40 30 Q -40 -10 -15 -20 L 15 -20 Q 40 -10 40 30 Z', {
        fill: '#e2e8f0', stroke: '#64748b', strokeWidth: 2,
        originX: 'center', originY: 'center'
      });
      
      const cap = new fabric.Rect({
        left: 0, top: -25, width: 16, height: 10,
        fill: '#94a3b8', stroke: '#475569', strokeWidth: 1.5,
        originX: 'center', originY: 'center'
      });
      
      const wick = new fabric.Rect({
        left: 0, top: -33, width: 4, height: 6,
        fill: '#475569',
        originX: 'center', originY: 'center'
      });
      
      const flame = new fabric.Path('M 0 -35 Q 10 -40 10 -50 Q 10 -65 0 -75 Q -10 -65 -10 -50 Q -10 -40 0 -35 Z', {
        fill: '#f97316', stroke: '#ea580c', strokeWidth: 1,
        originX: 'center', originY: 'center'
      });
      
      const innerFlame = new fabric.Path('M 0 -35 Q 5 -40 5 -47 Q 5 -55 0 -60 Q -5 -55 -5 -47 Q -5 -40 0 -35 Z', {
        fill: '#fef08a', stroke: 'transparent',
        originX: 'center', originY: 'center'
      });
      
      const lamp = new fabric.Group([body, cap, wick, flame, innerFlame], {
        left: x, top: y, originX: 'center', originY: 'center'
      });
      
      canvas.add(lamp);
      canvas.setActiveObject(lamp);
      canvas.renderAll();
    }
    
    function addCalorimeter() {
      const x = (canvas.width || 800) / 2;
      const y = (canvas.height || 600) / 2;
      
      const outerBox = new fabric.Rect({
        left: 0, top: 0, width: 120, height: 140,
        fill: '#f1f5f9', stroke: '#64748b', strokeWidth: 2,
        originX: 'center', originY: 'center', rx: 4, ry: 4
      });
      
      const innerBox = new fabric.Rect({
        left: 0, top: 5, width: 90, height: 120,
        fill: '#ffffff', stroke: '#94a3b8', strokeWidth: 1.5,
        originX: 'center', originY: 'center', rx: 2, ry: 2
      });
      
      const lid = new fabric.Rect({
        left: 0, top: -70, width: 130, height: 8,
        fill: '#cbd5e1', stroke: '#64748b', strokeWidth: 2,
        originX: 'center', originY: 'center'
      });
      
      // Thermometer
      const tGlass = new fabric.Rect({
        left: -20, top: -40, width: 8, height: 100,
        fill: '#f8fafc', stroke: '#94a3b8', strokeWidth: 1,
        originX: 'center', originY: 'center', rx: 4, ry: 4
      });
      const tBulb = new fabric.Circle({
        left: -20, top: 10, radius: 8,
        fill: '#ef4444', stroke: '#94a3b8', strokeWidth: 1,
        originX: 'center', originY: 'center'
      });
      
      // Stirrer
      const sRod = new fabric.Rect({
        left: 20, top: -30, width: 4, height: 110,
        fill: '#94a3b8', stroke: '#64748b', strokeWidth: 1,
        originX: 'center', originY: 'center'
      });
      const sRing = new fabric.Circle({
        left: 20, top: 25, radius: 12,
        fill: 'transparent', stroke: '#64748b', strokeWidth: 2,
        originX: 'center', originY: 'center'
      });
      const sHandle = new fabric.Rect({
        left: 20, top: -85, width: 16, height: 6,
        fill: '#64748b',
        originX: 'center', originY: 'center'
      });
      
      const cal = new fabric.Group([outerBox, innerBox, tGlass, tBulb, sRod, sRing, sHandle, lid], {
        left: x, top: y, originX: 'center', originY: 'center'
      });
      
      canvas.add(cal);
      canvas.setActiveObject(cal);
      canvas.renderAll();
    }
    
    function addTestTube() {
      const x = (canvas.width || 800) / 2;
      const y = (canvas.height || 600) / 2;
      
      const w = 24;
      const h = 120;
      
      const path = \`M \${-w/2} \${-h/2} L \${-w/2} \${h/2 - w/2} A \${w/2} \${w/2} 0 0 0 \${w/2} \${h/2 - w/2} L \${w/2} \${-h/2}\`;
      
      const tube = new fabric.Path(path, {
        fill: 'rgba(248, 250, 252, 0.5)', stroke: '#64748b', strokeWidth: 2,
        left: x, top: y, originX: 'center', originY: 'center'
      });
      
      canvas.add(tube);
      canvas.setActiveObject(tube);
      canvas.renderAll();
    }
    
    function addPistonCylinder() {
      const x = (canvas.width || 800) / 2;
      const y = (canvas.height || 600) / 2;
      
      const w = 150;
      const h = 60;
      
      const cylPath = \`M \${-w/2} \${-h/2} L \${w/2} \${-h/2} L \${w/2} \${h/2} L \${-w/2} \${h/2}\`;
      const cyl = new fabric.Path(cylPath, {
        fill: 'transparent', stroke: '#475569', strokeWidth: 3,
        originX: 'center', originY: 'center'
      });
      
      const pistonW = 20;
      const piston = new fabric.Rect({
        left: 0, top: 0, width: pistonW, height: h - 6,
        fill: '#94a3b8', stroke: '#475569', strokeWidth: 2,
        originX: 'center', originY: 'center'
      });
      
      const rod = new fabric.Rect({
        left: -w/2 - 20, top: 0, width: w/2 + 20, height: 6,
        fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2,
        originX: 'center', originY: 'center'
      });
      
      const pistonHandle = new fabric.Rect({
        left: -w/2 - 20, top: 0, width: 8, height: 30,
        fill: '#475569',
        originX: 'center', originY: 'center'
      });
      
      const sys = new fabric.Group([cyl, rod, pistonHandle, piston], {
        left: x, top: y, originX: 'center', originY: 'center'
      });
      
      canvas.add(sys);
      canvas.setActiveObject(sys);
      canvas.renderAll();
    }
    
    function addPressureGauge() {
      const x = (canvas.width || 800) / 2;
      const y = (canvas.height || 600) / 2;
      
      const r = 30;
      const outer = new fabric.Circle({
        left: 0, top: 0, radius: r,
        fill: '#ffffff', stroke: '#64748b', strokeWidth: 3,
        originX: 'center', originY: 'center'
      });
      
      const inner = new fabric.Circle({
        left: 0, top: 0, radius: r - 4,
        fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1,
        originX: 'center', originY: 'center'
      });
      
      const center = new fabric.Circle({
        left: 0, top: 0, radius: 3,
        fill: '#1e293b',
        originX: 'center', originY: 'center'
      });
      
      const needle = new fabric.Line([0, 0, 15, -15], {
        stroke: '#ef4444', strokeWidth: 2,
        originX: 'left', originY: 'bottom', left: 0, top: 0
      });
      
      const marks = [];
      for (let angle = -45; angle <= 225; angle += 30) {
        const rad = angle * Math.PI / 180;
        const x1 = (r - 4) * Math.cos(rad);
        const y1 = (r - 4) * Math.sin(rad);
        const x2 = (r - 10) * Math.cos(rad);
        const y2 = (r - 10) * Math.sin(rad);
        marks.push(new fabric.Line([x1, y1, x2, y2], {
          stroke: '#64748b', strokeWidth: 1, originX: 'center', originY: 'center'
        }));
      }
      
      const mount = new fabric.Rect({
        left: 0, top: r + 5, width: 10, height: 10,
        fill: '#94a3b8', stroke: '#475569', strokeWidth: 2,
        originX: 'center', originY: 'center'
      });
      
      const gauge = new fabric.Group([mount, outer, inner, ...marks, center, needle], {
        left: x, top: y, originX: 'center', originY: 'center'
      });
      
      canvas.add(gauge);
      canvas.setActiveObject(gauge);
      canvas.renderAll();
    }
`;

if (!html.includes('function addThermometer()')) {
    html = html.replace('function addContainer() {', toolsCode + '\n    function addContainer() {');
    console.log("Added thermo functions");
} else {
    console.log("Thermo functions already exist");
}

fs.writeFileSync('index.html', html);
