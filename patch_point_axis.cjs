const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldPointLogic = `              const axisY = (yMin <= 0 && yMax >= 0) ? originY : (pyVal > 0 ? height : 0);
              const axisX = (xMin <= 0 && xMax >= 0) ? originX : (pxVal > 0 ? 0 : width);
              
              if (isFinite(canvasX) && isFinite(canvasY)) {
                  // Dashed line to X axis
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, axisY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis
                  objs.push(new fabric.Line([canvasX, canvasY, axisX, canvasY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));`;

const newPointLogic = `              if (isFinite(canvasX) && isFinite(canvasY)) {
                  // Dashed line to X axis (y = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, originY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis (x = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, originX, canvasY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));`;

if (html.includes(oldPointLogic)) {
    html = html.replace(oldPointLogic, newPointLogic);
    console.log("Replaced axis projection logic");
} else {
    console.log("Could not find axis projection logic");
}

fs.writeFileSync('index.html', html);
