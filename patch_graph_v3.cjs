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
      const anchor = new fabric.Rect({ left: 0, top: 0, width: width, height: height, fill: 'transparent', stroke: 'transparent' });
      objs.push(anchor);
      
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
      
      const axisExt = 40;
      const arrowSize = 12;
      let endX = width;
      let endY = 0;
      
      if (yMin <= 0 && yMax >= 0) {
        endX = width + axisExt;
        const startX = -20;
        objs.push(new fabric.Line([startX, originY, endX - arrowSize, originY], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: endX - arrowSize, y: originY - arrowSize/2},
            {x: endX, y: originY},
            {x: endX - arrowSize, y: originY + arrowSize/2}
        ], { fill: '#1e293b', stroke: '#1e293b', strokeWidth: 1, strokeLineJoin: 'miter' }));
      }
      
      if (xMin <= 0 && xMax >= 0) {
        endY = -axisExt;
        const startY = height + 20;
        objs.push(new fabric.Line([originX, startY, originX, endY + arrowSize], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: originX - arrowSize/2, y: endY + arrowSize},
            {x: originX, y: endY},
            {x: originX + arrowSize/2, y: endY + arrowSize}
        ], { fill: '#1e293b', stroke: '#1e293b', strokeWidth: 1, strokeLineJoin: 'miter' }));
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
      
      rows.forEach(row => {
        const type = row.querySelector('.func-type').value;
        const expr = row.querySelector('.func-input').value;
        const color = row.querySelector('.func-color').value;
        const weight = parseInt(row.querySelector('.func-weight').value) || 2;
        const dash = row.querySelector('.func-dash').value;
        
        if (!expr || !window.math) return;
        
        let processedExpr = expr.trim();
        if (type === 'y' && processedExpr.startsWith('y=')) processedExpr = processedExpr.substring(2);
        else if (type === 'y' && processedExpr.startsWith('y =')) processedExpr = processedExpr.substring(3);
        else if (type === 'x' && processedExpr.startsWith('x=')) processedExpr = processedExpr.substring(2);
        else if (type === 'x' && processedExpr.startsWith('x =')) processedExpr = processedExpr.substring(3);
        
        if (processedExpr.startsWith('f(x)=')) processedExpr = processedExpr.substring(5);
        else if (processedExpr.startsWith('f(x) =')) processedExpr = processedExpr.substring(6);
        
        processedExpr = processedExpr.replace(/\\*\\*/g, '^');
        
        const dashArray = dash === 'dashed' ? [weight * 3, weight * 3] : null;
        
        let pDataStr = "";
        let isDrawing = false;
        let prevPx = null;
        let prevPy = null;
        
        try {
            const compiled = math.compile(processedExpr);
            
            if (type === 'y') {
                for (let px = 0; px <= width; px += 1) {
                  const x = (px - originX) / scaleX;
                  const y = compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(y) && !isNaN(y)) {
                    const py = originY - y * scaleY;
                    
                    if (py >= 0 && py <= height) {
                      if (!isDrawing) {
                         if (prevPx !== null && prevPy !== null) {
                            let intersectY = prevPy < 0 ? 0 : height;
                            let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
                            pDataStr += " M " + intersectX.toFixed(2) + " " + intersectY.toFixed(2) + " L " + px.toFixed(2) + " " + py.toFixed(2);
                         } else {
                            pDataStr += " M " + px.toFixed(2) + " " + py.toFixed(2);
                         }
                         isDrawing = true;
                      } else {
                         pDataStr += " L " + px.toFixed(2) + " " + py.toFixed(2);
                      }
                    } else {
                      if (isDrawing) {
                         let intersectY = py < 0 ? 0 : height;
                         let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
                         pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                         isDrawing = false;
                      }
                    }
                    prevPx = px;
                    prevPy = py;
                  } else {
                    isDrawing = false;
                    prevPx = null;
                    prevPy = null;
                  }
                }
            } else {
                for (let py = 0; py <= height; py += 1) {
                  const y = (originY - py) / scaleY;
                  const x = compiled.evaluate({ y: y, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(x) && !isNaN(x)) {
                    const px = originX + x * scaleX;
                    
                    if (px >= 0 && px <= width) {
                      if (!isDrawing) {
                         if (prevPx !== null && prevPy !== null) {
                            let intersectX = prevPx < 0 ? 0 : width;
                            let intersectY = prevPy + (py - prevPy) * (intersectX - prevPx) / (px - prevPx);
                            pDataStr += " M " + intersectX.toFixed(2) + " " + intersectY.toFixed(2) + " L " + px.toFixed(2) + " " + py.toFixed(2);
                         } else {
                            pDataStr += " M " + px.toFixed(2) + " " + py.toFixed(2);
                         }
                         isDrawing = true;
                      } else {
                         pDataStr += " L " + px.toFixed(2) + " " + py.toFixed(2);
                      }
                    } else {
                      if (isDrawing) {
                         let intersectX = px < 0 ? 0 : width;
                         let intersectY = prevPy + (py - prevPy) * (intersectX - prevPx) / (px - prevPx);
                         pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                         isDrawing = false;
                      }
                    }
                    prevPx = px;
                    prevPy = py;
                  } else {
                    isDrawing = false;
                    prevPx = null;
                    prevPy = null;
                  }
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
            const graphGroup = new fabric.Group([...objs], {
              left: 400, top: 300, originX: 'center', originY: 'center'
            });
            canvas.add(graphGroup);
            
            const absZeroX = graphGroup.left + anchor.left;
            const absZeroY = graphGroup.top + anchor.top;
            
            if (yMin <= 0 && yMax >= 0) {
                const xLbl = new fabric.Text(xLabelText, { 
                    left: absZeroX + endX + 15, 
                    top: absZeroY + originY, 
                    fontSize: 16, 
                    fill: '#1e293b', 
                    fontStyle: 'italic', 
                    fontFamily: 'Times New Roman', 
                    originX: 'left', 
                    originY: 'center' 
                });
                canvas.add(xLbl);
            }
            
            if (xMin <= 0 && xMax >= 0) {
                const yLbl = new fabric.Text(yLabelText, { 
                    left: absZeroX + originX, 
                    top: absZeroY + endY - 15, 
                    fontSize: 16, 
                    fill: '#1e293b', 
                    fontStyle: 'italic', 
                    fontFamily: 'Times New Roman', 
                    originX: 'center', 
                    originY: 'bottom' 
                });
                canvas.add(yLbl);
                
                if (yMin <= 0 && yMax >= 0) { 
                     const oLbl = new fabric.Text('O', { 
                        left: absZeroX + originX - 12, 
                        top: absZeroY + originY + 12, 
                        fontSize: 16, 
                        fill: '#1e293b', 
                        fontStyle: 'italic', 
                        fontFamily: 'Times New Roman', 
                        originX: 'right', 
                        originY: 'top' 
                     });
                     canvas.add(oLbl);
                }
            }
            
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
    console.log("Fixed drawGraph v3");
} else {
    console.log("Could not find drawGraph");
}
