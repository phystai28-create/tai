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

for (let px = 235; px <= 245; px += 1) {
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
            let intersectY = prevPy < py ? height : 0; // wait, if py > prevPy, it's going down on screen, towards height
            let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
            pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
            isDrawing = false;
        }
        // we will not connect them.
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
         if (!isAsymptote) {
            pDataStr += " L " + px.toFixed(2) + " " + py.toFixed(2);
         } else {
            // this branch shouldn't be reached if isAsymptote is true and isDrawing was true, because we set isDrawing = false above
            // wait, if isAsymptote is true and isDrawing was false, it stays false until py is in bounds.
            pDataStr += " M " + px.toFixed(2) + " " + py.toFixed(2);
            isDrawing = true;
         }
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

console.log(pDataStr);
