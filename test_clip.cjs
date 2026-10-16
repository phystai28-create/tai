const math = require('mathjs');

let width = 100;
let height = 100;
let originX = 50;
let originY = 50;
let scaleX = 10;
let scaleY = 10;

const compiled = math.compile("x^2");
let pDataStr = "";
let isDrawing = false;
let prevPx = null;
let prevPy = null;

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
            pDataStr += ` M ${intersectX.toFixed(2)} ${intersectY.toFixed(2)} L ${px.toFixed(2)} ${py.toFixed(2)}`;
         } else {
            pDataStr += ` M ${px.toFixed(2)} ${py.toFixed(2)}`;
         }
         isDrawing = true;
      } else {
         pDataStr += ` L ${px.toFixed(2)} ${py.toFixed(2)}`;
      }
    } else {
      if (isDrawing) {
         let intersectY = py < 0 ? 0 : height;
         let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
         pDataStr += ` L ${intersectX.toFixed(2)} ${intersectY.toFixed(2)}`;
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

console.log(pDataStr);
