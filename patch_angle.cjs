const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldCode = `      if (obj.type === 'line' || obj.type === 'arrow' || obj.type === 'double-arrow') {
         const p = obj.calcLinePoints();
         const dx = (p.x2 - p.x1) * obj.scaleX;
         const dy = (p.y2 - p.y1) * obj.scaleY;
         const len = Math.sqrt(dx*dx + dy*dy).toFixed(1);
         let ang = (Math.atan2(dy, dx) * 180 / Math.PI + obj.angle) % 360;
         if (ang < 0) ang += 360;
         ang = ang.toFixed(1);
         dimTooltip.innerHTML = \`L: \${len} | Ang: \${ang}° | W: \${w} | H: \${h}\`;`;

const newCode = `      if (obj.type === 'line' || obj.type === 'arrow' || obj.type === 'double-arrow') {
         const p = obj.calcLinePoints();
         const p1 = new fabric.Point(p.x1, p.y1);
         const p2 = new fabric.Point(p.x2, p.y2);
         const t = obj.calcTransformMatrix();
         const wp1 = fabric.util.transformPoint(p1, t);
         const wp2 = fabric.util.transformPoint(p2, t);
         const dx = wp2.x - wp1.x;
         const dy = wp2.y - wp1.y;
         const len = Math.sqrt(dx*dx + dy*dy).toFixed(1);
         let ang = Math.atan2(-dy, dx) * 180 / Math.PI; // -dy because canvas Y is inverted
         if (ang < 0) ang += 360;
         ang = ang.toFixed(1);
         dimTooltip.innerHTML = \`L: \${len} | Ang: \${ang}° | W: \${w} | H: \${h}\`;`;

if (html.includes(oldCode)) {
    html = html.replace(oldCode, newCode);
    console.log("Replaced angle calculation");
} else {
    console.log("Could not find angle calculation");
}

fs.writeFileSync('index.html', html);
