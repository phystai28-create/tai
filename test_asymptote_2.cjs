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

for (let px = 190; px <= 210; px += 1) {
  const x = (px - originX) / scaleX;
  const y = compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
  
  if (isFinite(y) && !isNaN(y)) {
    const py = originY - y * scaleY;
    
    let isAsymptote = false;
    if (prevPx !== null && prevPy !== null) {
       if (Math.abs(py - prevPy) > height) {
          isAsymptote = true;
       }
    }
    
    if (isAsymptote) {
        if (isDrawing) {
            // Draw to the edge before breaking
            let intersectY = prevPy < py ? 0 : height; // wait, prevPy < py means it's going down on screen, so towards yMax on screen (which is 0 or height?)
            // screen y: 0 is top (yMax), height is bottom (yMin).
            // if py is large positive, it means y is very negative.
            let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
            pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
            isDrawing = false;
        }
        // Start new path segment? No, the new point might be out of bounds too, it will be handled.
        // Wait, if it's an asymptote, we just reset prevPx, prevPy so it starts fresh
        prevPx = null; 
        prevPy = null;
        isDrawing = false;
        // then we process the current point as if it's the first point
    }
    
    if (py >= 0 && py <= height) {
      if (!isDrawing) {
         if (prevPx !== null && prevPy !== null && !isAsymptote) {
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
    if (!isAsymptote) {
        prevPx = px;
        prevPy = py;
    } else {
        prevPx = px;
        prevPy = py; // still keep it for the next point!
    }
  } else {
    isDrawing = false;
    prevPx = null;
    prevPy = null;
  }
}

console.log(pDataStr);
