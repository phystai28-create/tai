const math = require('mathjs');

let width = 400;
let height = 400;
let originX = 200;
let originY = 200;
let scaleX = 40;
let scaleY = 40;

const compiled = math.compile("(x+1)/(x-1)");
let pDataStr = "";
let isDrawing = false;
let prevPx = null;
let prevPy = null;
let prevY = null;

for (let px = 180; px <= 220; px += 1) {
  const x = (px - originX) / scaleX;
  const y = compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
  
  if (isFinite(y) && !isNaN(y)) {
    const py = originY - y * scaleY;
    
    // Asymptote break detection
    let isAsymptote = false;
    if (prevY !== null && Math.abs(y - prevY) > 5) {
        isAsymptote = true; // sudden jump in function value (e.g., across asymptote)
    }
    
    if (py >= 0 && py <= height && !isAsymptote) {
      if (!isDrawing) {
         pDataStr += ` M ${px.toFixed(2)} ${py.toFixed(2)}`;
         isDrawing = true;
      } else {
         pDataStr += ` L ${px.toFixed(2)} ${py.toFixed(2)}`;
      }
    } else {
      isDrawing = false;
    }
    prevPx = px;
    prevPy = py;
    prevY = y;
  } else {
    isDrawing = false;
    prevPx = null;
    prevPy = null;
    prevY = null;
  }
}

console.log(pDataStr);
