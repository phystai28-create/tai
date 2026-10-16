const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldDashedLogic = `                  // Dashed line to X axis (y = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, originY], { stroke: '#000000', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis (x = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, originX, canvasY], { stroke: '#000000', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  
                  // Point circle
                  const showDotCheckbox = row.querySelector('.point-show-dot');
                  const showDot = showDotCheckbox ? showDotCheckbox.checked : true;
                  if (showDot) {
                      objs.push(new fabric.Circle({ left: canvasX, top: canvasY, radius: 3, fill: '#000000', originX: 'center', originY: 'center' }));
                  }`;

const newDashedLogic = `                  // Dashed line to X axis (y = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, originY], { stroke: '#1e293b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis (x = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, originX, canvasY], { stroke: '#1e293b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  
                  // Point circle
                  const showDotCheckbox = row.querySelector('.point-show-dot');
                  const showDot = showDotCheckbox ? showDotCheckbox.checked : true;
                  if (showDot) {
                      objs.push(new fabric.Circle({ left: canvasX, top: canvasY, radius: 3, fill: '#1e293b', originX: 'center', originY: 'center' }));
                  }`;

if (html.includes(oldDashedLogic)) {
    html = html.replace(oldDashedLogic, newDashedLogic);
    console.log("Replaced dashed line color to match axis");
} else {
    console.log("Could not find dashed line logic");
}

fs.writeFileSync('index.html', html);
