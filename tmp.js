function drawGraph() {
                    function drawGraph() {
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
      
      const scaleX = parseFloat(document.getElementById('graph-scale-x')?.value) || 40;
      const scaleY = parseFloat(document.getElementById('graph-scale-y')?.value) || 40;
      const width = (xMax - xMin) * scaleX;
      const height = (yMax - yMin) * scaleY;
      
      if (isNaN(width) || width <= 0 || !isFinite(width) || isNaN(height) || height <= 0 || !isFinite(height)) {
          showToast("Lỗi tính toán kích thước.");
          return;
      }
      
      const originX = -xMin * scaleX;
      const originY = yMax * scaleY;
      
      const objs = [];
      const anchor = new fabric.Rect({ left: 0, top: 0, width: width, height: height, fill: 'transparent', stroke: 'transparent' });
      objs.push(anchor);
      
      if (showGrid) {
        for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
          const px = originX + x * scaleX;
          if (isFinite(px)) objs.push(new fabric.Line([px, 0, px, height], { stroke: '#94a3b8', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
        }
        for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
          const py = originY - y * scaleY;
          if (isFinite(py)) objs.push(new fabric.Line([0, py, width, py], { stroke: '#94a3b8', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
        }
      }
      
      const axisExt = 25;
      const arrowSize = 10;
      
      const xDrawMinStr = document.getElementById('graph-axis-x-draw-min')?.value;
      const xDrawMaxStr = document.getElementById('graph-axis-x-draw-max')?.value;
      const yDrawMinStr = document.getElementById('graph-axis-y-draw-min')?.value;
      const yDrawMaxStr = document.getElementById('graph-axis-y-draw-max')?.value;
      
      let endX = width;
      let endY = 0;
      
      if (yMin <= 0 && yMax >= 0) {
        endX = width + axisExt;
        let startX = -15;
        if (xDrawMinStr && !isNaN(parseFloat(xDrawMinStr))) startX = originX + parseFloat(xDrawMinStr) * scaleX;
        if (xDrawMaxStr && !isNaN(parseFloat(xDrawMaxStr))) endX = originX + parseFloat(xDrawMaxStr) * scaleX;
        
        objs.push(new fabric.Line([startX, originY, endX, originY], { stroke: '#000000', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: endX - arrowSize, y: originY - arrowSize/2.5},
            {x: endX + 3, y: originY},
            {x: endX - arrowSize, y: originY + arrowSize/2.5}
        ], { fill: '#000000', stroke: '#000000', strokeWidth: 1, strokeLineJoin: 'miter' }));
      }
      
      if (xMin <= 0 && xMax >= 0) {
        endY = -axisExt;
        let startY = height + 15;
        if (yDrawMinStr && !isNaN(parseFloat(yDrawMinStr))) startY = originY - parseFloat(yDrawMinStr) * scaleY;
        if (yDrawMaxStr && !isNaN(parseFloat(yDrawMaxStr))) endY = originY - parseFloat(yDrawMaxStr) * scaleY;
        
        objs.push(new fabric.Line([originX, startY, originX, endY], { stroke: '#000000', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: originX - arrowSize/2.5, y: endY + arrowSize},
            {x: originX, y: endY - 3},
            {x: originX + arrowSize/2.5, y: endY + arrowSize}
        ], { fill: '#000000', stroke: '#000000', strokeWidth: 1, strokeLineJoin: 'miter' }));
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
            objs.push(new fabric.Line([px, py-4, px, py+4], { stroke: '#000000', strokeWidth: 2 }));
            objs.push(new fabric.Text(formatNum(x), { 
                left: px, top: py + 8, fontSize: 14, fill: '#000000', fontFamily: 'Times New Roman', originX: 'center', originY: 'top' 
            }));
        }
      }
      
      for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
        if (Math.abs(y) < 1e-5) continue;
        const py = originY - y * scaleY;
        const px = (xMin <= 0 && xMax >= 0) ? originX : 0;
        if (isFinite(px) && isFinite(py)) {
            objs.push(new fabric.Line([px-4, py, px+4, py], { stroke: '#000000', strokeWidth: 2 }));
            objs.push(new fabric.Text(formatNum(y), { 
                left: px - 8, top: py, fontSize: 14, fill: '#000000', fontFamily: 'Times New Roman', originX: 'right', originY: 'center' 
            }));
        }
      }

      rows.forEach(row => {
        let type = row.querySelector('.func-type').value;
        let expr = row.querySelector('.func-input').value.trim();
        let color = row.querySelector('.func-color').value;
        let weight = parseFloat(row.querySelector('.func-weight').value) || 2;
        let dash = row.querySelector('.func-dash').value;
        
        if (!expr) return;
        let processedExpr = expr.toLowerCase();
        if (type === 'y' && processedExpr.startsWith('y=')) processedExpr = processedExpr.substring(2);
        else if (type === 'y' && processedExpr.startsWith('y =')) processedExpr = processedExpr.substring(3);
        else if (type === 'x' && processedExpr.startsWith('x=')) processedExpr = processedExpr.substring(2);
        else if (type === 'x' && processedExpr.startsWith('x =')) processedExpr = processedExpr.substring(3);
        
        if (processedExpr.startsWith('f(x)=')) processedExpr = processedExpr.substring(5);
        else if (processedExpr.startsWith('f(x) =')) processedExpr = processedExpr.substring(6);
        
        processedExpr = processedExpr.replace(/\*\*/g, '^');
        processedExpr = processedExpr.replace(/π/g, 'pi');
        
        const dashArray = dash === 'dashed' ? [weight * 3, weight * 3] : null;
        
        let pDataStr = "";
        let isDrawing = false;
        let prevPx = null;
        let prevPy = null;
        let prevVal = null;
        
        try {
            const compiled = math.compile(processedExpr);
            
            if (type === 'y') {
                let startPx = 0;
                let endPx = width;
                
                for (let px = startPx; px <= endPx; px += 1) {
                  const x = (px - originX) / scaleX;
                  const y = compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(y) && !isNaN(y)) {
                    let py = originY - y * scaleY;
                    
                    let isAsymptote = false;
                    if (prevVal !== null && Math.sign(y) !== Math.sign(prevVal) && Math.abs(py - prevPy) > height) {
                        isAsymptote = true;
                    }
                    
                    if (isAsymptote) {
                        if (isDrawing) {
                           let intersectY = prevPy < py ? -height : height*2; 
                           let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
                           pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                        }
                        isDrawing = false;
                    }
                    
                    if (py >= -height && py <= height*2) {
                      if (!isDrawing) {
                         if (prevPx !== null && prevPy !== null && !isAsymptote) {
                            let intersectY = prevPy < -height ? -height : height*2;
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
                         let intersectY = py < -height ? -height : height*2;
                         let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
                         pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                         isDrawing = false;
                      }
                    }
                    prevPx = px;
                    prevPy = py;
                    prevVal = y;
                  } else {
                    isDrawing = false;
                    prevPx = null;
                    prevPy = null;
                    prevVal = null;
                  }
                }
            } else {
                let startPy = 0;
                let endPy = height;
                
                for (let py = startPy; py <= endPy; py += 1) {
                  const y = (originY - py) / scaleY;
                  const x = compiled.evaluate({ y: y, e: Math.E, pi: Math.PI, x: y }); // map x to y for x=a eq
                  
                  if (isFinite(x) && !isNaN(x)) {
                    let px = originX + x * scaleX;
                    
                    let isAsymptote = false;
                    if (prevVal !== null && Math.sign(x) !== Math.sign(prevVal) && Math.abs(px - prevPx) > width) {
                        isAsymptote = true;
                    }
                    
                    if (isAsymptote) {
                        if (isDrawing) {
                           let intersectX = prevPx < px ? -width : width*2;
                           let intersectY = prevPy + (py - prevPy) * (intersectX - prevPx) / (px - prevPx);
                           pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                        }
                        isDrawing = false;
                    }
                    
                    if (px >= -width && px <= width*2) {
                      if (!isDrawing) {
                         if (prevPx !== null && prevPy !== null && !isAsymptote) {
                            let intersectX = prevPx < -width ? -width : width*2;
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
                         let intersectX = px < -width ? -width : width*2;
                         let intersectY = prevPy + (py - prevPy) * (intersectX - prevPx) / (px - prevPx);
                         pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                         isDrawing = false;
                      }
                    }
                    prevPx = px;
                    prevPy = py;
                    prevVal = x;
                  } else {
                    isDrawing = false;
                    prevPx = null;
                    prevPy = null;
                    prevVal = null;
                  }
                }
            }
            
            if (pDataStr && pDataStr.includes('L')) {
              objs.push(new fabric.Path(pDataStr.trim(), { fill: 'transparent', stroke: color, strokeWidth: weight, strokeDashArray: dashArray, strokeLineJoin: 'round', objectCaching: false }));
            }
        } catch(e) {
            console.error(e);
        }
      });
      
      const pointRows = document.querySelectorAll('#graph-points-list > div');
      pointRows.forEach(row => {
          const pxVal = parseFloat(row.querySelector('.point-x').value);
          const pyVal = parseFloat(row.querySelector('.point-y').value);
          const pName = row.querySelector('.point-name').value;
          
          if (!isNaN(pxVal) && !isNaN(pyVal)) {
              const canvasX = originX + pxVal * scaleX;
              const canvasY = originY - pyVal * scaleY;
              
              if (isFinite(canvasX) && isFinite(canvasY)) {
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, originY], { stroke: '#000000', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  objs.push(new fabric.Line([canvasX, canvasY, originX, canvasY], { stroke: '#000000', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  
                  const showDotCheckbox = row.querySelector('.point-show-dot');
                  const showDot = showDotCheckbox ? showDotCheckbox.checked : true;
                  if (showDot) {
                      objs.push(new fabric.Circle({ left: canvasX, top: canvasY, radius: 4, fill: '#000000', originX: 'center', originY: 'center' }));
                  }
                  
                  if (pName) {
                      objs.push(new fabric.Text(pName, { left: canvasX + 6, top: canvasY - 6, fontSize: 16, fill: '#000000', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'left', originY: 'bottom' }));
                  }
              }
          }
      });
      
      if (objs.length > 0) {
        try {
            const subGroup = new fabric.Group([...objs], {
              objectCaching: false
            });
            
            const groupObjs = [subGroup];
            
            if (yMin <= 0 && yMax >= 0) {
                const xLbl = new fabric.Text(xLabelText, { 
                    left: endX + 10, 
                    top: originY, 
                    fontSize: 16, fill: '#000000', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'left', originY: 'center' 
                });
                groupObjs.push(xLbl);
            }
            
            if (xMin <= 0 && xMax >= 0) {
                const yLbl = new fabric.Text(yLabelText, { 
                    left: originX, 
                    top: endY - 10, 
                    fontSize: 16, fill: '#000000', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'center', originY: 'bottom' 
                });
                groupObjs.push(yLbl);
                
                if (yMin <= 0 && yMax >= 0) { 
                     const oLbl = new fabric.Text('O', { 
                        left: originX - 6, 
                        top: originY + 6, 
                        fontSize: 16, fill: '#000000', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'right', originY: 'top' 
                     });
                     groupObjs.push(oLbl);
                }
            }
            
            const graphGroup = new fabric.Group(groupObjs, {
              left: 400, top: 300, originX: 'center', originY: 'center', objectCaching: false
            });
            
            canvas.add(graphGroup);
            canvas.setActiveObject(graphGroup);
        } catch(err) {
            console.error(err);
            showToast("Lỗi khi tạo nhóm đồ thị.");
        }
      }
      // Graph created
    }

    
    let canvasGridLines = [];
    window.toggleGrid = function() {
        const gridBtn = document.getElementById('grid-toggle-btn');
        if (canvasGridLines.length > 0) {
            // hide grid
            canvasGridLines.forEach(line => canvas.remove(line));
            canvasGridLines = [];
            gridBtn.classList.remove('bg-blue-600', 'text-white');
            gridBtn.classList.add('bg-blue-500/20', 'text-blue-100');
        } else {
            // show grid
            const gridSize = 40; // 40px grid
            for (let i = 0; i <= canvas.width / gridSize; i++) {
                const line = new fabric.Line([i * gridSize, 0, i * gridSize, canvas.height], {
                    stroke: '#e2e8f0', strokeWidth: 1, selectable: false, evented: false
                });
                canvasGridLines.push(line);
                canvas.add(line);
                line.sendToBack();
            }
            for (let i = 0; i <= canvas.height / gridSize; i++) {
                const line = new fabric.Line([0, i * gridSize, canvas.width, i * gridSize], {
                    stroke: '#e2e8f0', strokeWidth: 1, selectable: false, evented: false
                });
                canvasGridLines.push(line);
                canvas.add(line);
                line.sendToBack();
            }
            gridBtn.classList.add('bg-blue-600', 'text-white');
            gridBtn.classList.remove('bg-blue-500/20', 'text-blue-100');
        }
        canvas.renderAll();
    };

    function groupObjects() {
      const active = canvas.getActiveObject();
      if (!active || active.type !== 'activeSelection') {
        showToast('Vui lòng quét chọn nhiều đối tượng để nhóm.');
        return;
      }
      active.toGroup();
      canvas.requestRenderAll();
      showToast('Đã nhóm các đối tượng.');
    }

    function ungroupObjects() {
      const active = canvas.getActiveObject();
      if (!active || active.type !== 'group') {
        showToast('Vui lòng chọn một nhóm để tách.');
        return;
      }
      active.toActiveSelection();
      canvas.requestRenderAll();
      showToast('Đã tách nhóm.');
    }

    function copyToClipboard() {
      canvas.discardActiveObject();
      canvas.renderAll();
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 2,
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height
      });
      
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          if (navigator.clipboard && window.ClipboardItem) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
              showToast("Đã copy thành công, bạn có thể dán (Ctrl+V) vào Word!");
            }).catch(err => {
              console.error(err);
              fallbackDownload(dataURL);
            });
          } else {
             fallbackDownload(dataURL);
          }
        }).catch(err => {
          showToast("Lỗi tạo ảnh.");
          console.error(err);
        });
    }

    function fallbackDownload(dataURL) {
      showToast("Không thể copy trực tiếp, đang tải ảnh xuống...");
      const link = document.createElement('a');
      link.download = 'physics_drawing.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function showToast(msg) {
        const t = document.getElementById('toastMsg');
        t.innerText = msg;
        t.parentElement.classList.remove('translate-y-[150%]');
        setTimeout(() => {
            t.parentElement.classList.add('translate-y-[150%]');
        }, 3000);
    }

  
</script>
</body>
</html>
