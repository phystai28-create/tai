const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix clearCanvas
const oldClear = /function clearCanvas\(\) \{[\s\S]*?canvas\.renderAll\(\);\s*\}\s*\}/;
const newClear = `    function clearCanvas() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ bảng vẽ?")) {
        canvas.discardActiveObject();
        const objs = canvas.getObjects().slice();
        objs.forEach(o => canvas.remove(o));
        canvas.requestRenderAll();
      }
    }`;
if (html.match(oldClear)) {
    html = html.replace(oldClear, newClear);
    console.log("Fixed clearCanvas");
}

// Fix addSpringScale (hooks)
const oldSpringScale = /function addSpringScale\(\) \{[\s\S]*?canvas\.setActiveObject\(group\);\s*\}/;
if (html.match(oldSpringScale)) {
    const replacement = `    function addSpringScale() {
      const body = new fabric.Rect({
        left: -25, top: -90, width: 50, height: 180,
        fill: '#f1f5f9', stroke: '#1e3a8a', strokeWidth: 3, rx: 2, ry: 2
      });
      
      const topHook = new fabric.Path('M 0 -90 L 0 -100 C 0 -110 -10 -100 -10 -110 A 10 10 0 0 1 10 -110', {
        fill: 'transparent', stroke: '#475569', strokeWidth: 3, strokeLineCap: 'round'
      });
      
      let springPath = 'M 0 -90 L 0 -85';
      for(let i=0; i<12; i++) {
        springPath += \` L \${i%2===0 ? 10 : -10} \${-80 + i*5}\`;
      }
      springPath += ' L 0 -25 L 0 -16';
      const spring = new fabric.Path(springPath, {
        fill: 'transparent', stroke: '#3b82f6', strokeWidth: 2.5, strokeLineJoin: 'round'
      });
      
      const innerRod = new fabric.Line([0, -16, 0, 110], {
        stroke: '#475569', strokeWidth: 3
      });
      
      const bottomHook = new fabric.Path('M 0 110 L 0 120 C 0 130 -10 120 -10 130 A 10 10 0 0 0 10 130', {
        fill: 'transparent', stroke: '#475569', strokeWidth: 3, strokeLineCap: 'round'
      });
      
      const marker = new fabric.Line([-15, -16, 15, -16], {
        stroke: '#ef4444', strokeWidth: 4
      });
      
      const tickElems = [];
      for(let i=0; i<=5; i++) {
        let ty = -16 + i * 18;
        tickElems.push(new fabric.Line([5, ty, 15, ty], { stroke: '#1e3a8a', strokeWidth: 2 }));
        if(i < 5) {
          tickElems.push(new fabric.Line([8, ty + 9, 15, ty + 9], { stroke: '#1e3a8a', strokeWidth: 1.5 }));
        }
        tickElems.push(new fabric.Text(i.toString(), {
          left: 20, top: ty, fontSize: 12, fill: '#0f172a', fontWeight: 'bold', originY: 'center'
        }));
      }
      
      const nText = new fabric.Text('N', {
        left: -20, top: 74, fontSize: 16, fill: '#0f172a', fontWeight: 'bold'
      });
      
      const group = new fabric.Group([body, topHook, spring, innerRod, bottomHook, marker, nText, ...tickElems], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }`;
    html = html.replace(oldSpringScale, replacement);
    console.log("Fixed addSpringScale");
}

// Fix drawGraph
const oldGraph = /if \(objs\.length > 0\) \{[\s\S]*?closeGraphDialog\(\);\s*\}/;
if (html.match(oldGraph)) {
    const replacement = `if (objs.length > 0) {
        const offsetX = 400 - width / 2;
        const offsetY = 300 - height / 2;
        
        // Group all objects so it can be moved and deleted together
        const graphGroup = new fabric.Group([...objs, ...labels], {
          left: 400, top: 300, originX: 'center', originY: 'center'
        });
        
        canvas.add(graphGroup);
        canvas.setActiveObject(graphGroup);
      }
      closeGraphDialog();
    }`;
    html = html.replace(oldGraph, replacement);
    console.log("Fixed drawGraph");
}

fs.writeFileSync('index.html', html);
