const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function drawGraph\(\) \{[\s\S]*?closeGraphDialog\(\);\s*\}/;
const replacement = `    function drawGraph() {
      const rows = document.querySelectorAll('#graph-functions-list > div');
      
      const xMin = parseFloat(document.getElementById('graph-xmin').value);
      const xMax = parseFloat(document.getElementById('graph-xmax').value);
      const xStep = parseFloat(document.getElementById('graph-xstep').value);
      const yMin = parseFloat(document.getElementById('graph-ymin').value);
      const yMax = parseFloat(document.getElementById('graph-ymax').value);
      const yStep = parseFloat(document.getElementById('graph-ystep').value);
      
      if (isNaN(xMin) || isNaN(xMax) || isNaN(xStep) || isNaN(yMin) || isNaN(yMax) || isNaN(yStep)) {
          showToast("Vui lòng nhập số hợp lệ.");
          return;
      }
      if (xMax <= xMin || yMax <= yMin || xStep <= 0 || yStep <= 0) {
          showToast("Max phải lớn hơn Min, và Step phải lớn hơn 0.");
          return;
      }

      const showGrid = document.getElementById('graph-grid').checked;
      const xLabelText = document.getElementById('graph-xlabel').value || 'x';
      const yLabelText = document.getElementById('graph-ylabel').value || 'y';
      
      const width = 400;
      const height = (yMax - yMin) / (xMax - xMin) * width; 
      
      if (isNaN(height) || height <= 0 || !isFinite(height)) {
          showToast("Lỗi tính toán kích thước.");
          return;
      }
      
      const scaleX = width / (xMax - xMin);
      const scaleY = height / (yMax - yMin);
      
      const originX = -xMin * scaleX;
      const originY = yMax * scaleY;
      
      const objs = [];
      const labels = [];
      
      objs.push(new fabric.Rect({ left: 0, top: 0, width: width, height: height, fill: 'transparent', stroke: 'transparent' }));
      
      if (showGrid) {
        for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
          const px = originX + x * scaleX;
          if (isFinite(px)) objs.push(new fabric.Line([px, 0, px, height], { stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
        }
        for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
          const py = originY - y * scaleY;
          if (isFinite(py)) objs.push(new fabric.Line([0, py, width, py], { stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
        }
      }
      
      if (yMin <= 0 && yMax >= 0) {
        objs.push(new fabric.Line([0, originY, width, originY], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Path(\`M \${width-10} \${originY-5} L \${width} \${originY} L \${width-10} \${originY+5}\`, { fill: 'transparent', stroke: '#1e293b', strokeWidth: 2, strokeLineJoin: 'round', strokeLineCap: 'round' }));
        labels.push(new fabric.Text(xLabelText, { left: width + 10, top: originY, fontSize: 16, fill: '#1e293b', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'left', originY: 'center' }));
      }
      if (xMin <= 0 && xMax >= 0) {
        objs.push(new fabric.Line([originX, 0, originX, height], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Path(\`M \${originX-5} 10 L \${originX} 0 L \${originX+5} 10\`, { fill: 'transparent', stroke: '#1e293b', strokeWidth: 2, strokeLineJoin: 'round', strokeLineCap: 'round' }));
        labels.push(new fabric.Text(yLabelText, { left: originX, top: -15, fontSize: 16, fill: '#1e293b', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'center', originY: 'bottom' }));
      }
      
      const formatNum = (num) => { 
         let s = parseFloat(num.toPrecision(10)).toString(); 
         return s.replace('.', ',');
      };

      for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
        if (Math.abs(x) < 1e-5) continue;
        const px = originX + x * scaleX;
        const py = (yMin <= 0 && yMax >= 0) ? originY : height;
        if (isFinite(px) && isFinite(py)) {
            objs.push(new fabric.Line([px, py-4, px, py+4], { stroke: '#1e293b', strokeWidth: 2 }));
            objs.push(new fabric.Text(formatNum(x), { left: px, top: py + 12, fontSize: 14, fill: '#334155', fontFamily: 'Times New Roman', originX: 'center' }));
        }
      }
      for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
        if (Math.abs(y) < 1e-5) continue;
        const py = originY - y * scaleY;
        const px = (xMin <= 0 && xMax >= 0) ? originX : 0;
        if (isFinite(px) && isFinite(py)) {
            objs.push(new fabric.Line([px-4, py, px+4, py], { stroke: '#1e293b', strokeWidth: 2 }));
            objs.push(new fabric.Text(formatNum(y), { left: px - 8, top: py, fontSize: 14, fill: '#334155', fontFamily: 'Times New Roman', originX: 'right', originY: 'center' }));
        }
      }
      
      if (xMin <= 0 && xMax >= 0 && yMin <= 0 && yMax >= 0) { 
         labels.push(new fabric.Text('O', { left: originX - 12, top: originY + 12, fontSize: 16, fill: '#1e293b', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'right', originY: 'top' }));
      }
      
      rows.forEach(row => {
        const type = row.querySelector('.func-type').value;
        const expr = row.querySelector('.func-input').value;
        const color = row.querySelector('.func-color').value;
        const weight = parseInt(row.querySelector('.func-weight').value) || 2;
        const dash = row.querySelector('.func-dash').value;
        
        if (!expr || !window.math) return;
        
        const dashArray = dash === 'dashed' ? [weight * 3, weight * 3] : null;
        
        let pDataStr = "";
        let isDrawing = false;
        
        try {
            const compiled = math.compile(expr);
            
            if (type === 'y') {
                for (let px = 0; px <= width; px += 1) {
                  const x = (px - originX) / scaleX;
                  const y = compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(y) && !isNaN(y)) {
                    const py = originY - y * scaleY;
                    if (py >= 0 && py <= height) {
                      if (!isDrawing) { pDataStr += \` M \${px} \${py}\`; isDrawing = true; } 
                      else { pDataStr += \` L \${px} \${py}\`; }
                    } else { isDrawing = false; }
                  } else { isDrawing = false; }
                }
            } else {
                for (let py = 0; py <= height; py += 1) {
                  const y = (originY - py) / scaleY;
                  const x = compiled.evaluate({ y: y, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(x) && !isNaN(x)) {
                    const px = originX + x * scaleX;
                    if (px >= 0 && px <= width) {
                      if (!isDrawing) { pDataStr += \` M \${px} \${py}\`; isDrawing = true; } 
                      else { pDataStr += \` L \${px} \${py}\`; }
                    } else { isDrawing = false; }
                  } else { isDrawing = false; }
                }
            }
            
            if (pDataStr && pDataStr.includes('L')) {
              objs.push(new fabric.Path(pDataStr.trim(), { fill: 'transparent', stroke: color, strokeWidth: weight, strokeDashArray: dashArray, strokeLineJoin: 'round' }));
            }
        } catch(e) {
            console.error(e);
        }
      });
      
      if (objs.length > 0) {
        try {
            const graphGroup = new fabric.Group([...objs, ...labels], {
              left: 400, top: 300, originX: 'center', originY: 'center'
            });
            canvas.add(graphGroup);
            canvas.setActiveObject(graphGroup);
        } catch(err) {
            console.error(err);
            showToast("Lỗi khi tạo nhóm đồ thị.");
        }
      }
      closeGraphDialog();
    }`;

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html);
    console.log("Fixed drawGraph");
} else {
    console.log("Could not find drawGraph");
}
