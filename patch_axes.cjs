const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldAxesDrawLogic = `      const axisExt = 40;
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
      }`;

const newAxesDrawLogic = `      const axisExt = 40;
      const arrowSize = 12;
      
      const xDrawMinStr = document.getElementById('graph-axis-x-draw-min')?.value;
      const xDrawMaxStr = document.getElementById('graph-axis-x-draw-max')?.value;
      const yDrawMinStr = document.getElementById('graph-axis-y-draw-min')?.value;
      const yDrawMaxStr = document.getElementById('graph-axis-y-draw-max')?.value;
      
      let endX = width;
      let endY = 0;
      
      if (yMin <= 0 && yMax >= 0) {
        endX = width + axisExt;
        let startX = -20;
        if (xDrawMinStr && !isNaN(parseFloat(xDrawMinStr))) startX = originX + parseFloat(xDrawMinStr) * scaleX;
        if (xDrawMaxStr && !isNaN(parseFloat(xDrawMaxStr))) endX = originX + parseFloat(xDrawMaxStr) * scaleX;
        
        objs.push(new fabric.Line([startX, originY, endX - arrowSize, originY], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: endX - arrowSize, y: originY - arrowSize/2},
            {x: endX, y: originY},
            {x: endX - arrowSize, y: originY + arrowSize/2}
        ], { fill: '#1e293b', stroke: '#1e293b', strokeWidth: 1, strokeLineJoin: 'miter' }));
      }
      
      if (xMin <= 0 && xMax >= 0) {
        endY = -axisExt;
        let startY = height + 20;
        if (yDrawMinStr && !isNaN(parseFloat(yDrawMinStr))) startY = originY - parseFloat(yDrawMinStr) * scaleY;
        if (yDrawMaxStr && !isNaN(parseFloat(yDrawMaxStr))) endY = originY - parseFloat(yDrawMaxStr) * scaleY;
        
        objs.push(new fabric.Line([originX, startY, originX, endY + arrowSize], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: originX - arrowSize/2, y: endY + arrowSize},
            {x: originX, y: endY},
            {x: originX + arrowSize/2, y: endY + arrowSize}
        ], { fill: '#1e293b', stroke: '#1e293b', strokeWidth: 1, strokeLineJoin: 'miter' }));
      }`;

if (html.includes(oldAxesDrawLogic)) {
    html = html.replace(oldAxesDrawLogic, newAxesDrawLogic);
    console.log("Replaced axes draw logic");
} else {
    console.log("Could not find axes draw logic");
}

fs.writeFileSync('index.html', html);
