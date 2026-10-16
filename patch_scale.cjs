const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexDialogGrid = /<div class="flex items-center gap-2 border p-3 rounded bg-slate-50">[\s\S]*?<label for="graph-grid" class="font-bold text-slate-600 cursor-pointer">Hiển thị ô lưới \(Grid\)<\/label>\s*<\/div>/;
const newDialogGrid = `<div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <input type="checkbox" id="graph-grid" class="w-4 h-4 cursor-pointer" checked />
          <label for="graph-grid" class="font-bold text-slate-600 cursor-pointer">Hiển thị ô lưới</label>
        </div>
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <label for="graph-scale" class="font-bold text-slate-600 whitespace-nowrap">Tỉ lệ (px/đv):</label>
          <input type="number" id="graph-scale" value="40" min="1" class="border p-1.5 rounded focus:outline-slate-400 w-full" />
        </div>
      </div>`;

if (html.match(regexDialogGrid)) {
    html = html.replace(regexDialogGrid, newDialogGrid);
    console.log("Replaced grid config in dialog");
} else {
    console.log("Could not find grid config in dialog");
}

const regexPointsList = /<div class="flex flex-col gap-2">[\s\S]*?<h3 class="font-bold text-slate-800">Các hàm số<\/h3>/;
const newPointsList = `<div class="flex flex-col gap-2">
          <h3 class="font-bold text-slate-800">Các điểm đặc biệt (kẻ nét đứt)</h3>
          <div id="graph-points-list" class="flex flex-col gap-2"></div>
          <button onclick="addGraphPoint()" class="self-start mt-1 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium hover:bg-slate-200 transition-colors">+ Thêm điểm</button>
        </div>
        <div class="flex flex-col gap-2 mt-4">
          <h3 class="font-bold text-slate-800">Các hàm số</h3>`;

if (html.match(regexPointsList)) {
    html = html.replace(regexPointsList, newPointsList);
    console.log("Added points list section");
} else {
    console.log("Could not find points list section");
}

const addPointFunc = `
    function addGraphPoint() {
      const container = document.getElementById('graph-points-list');
      if (!container) return;
      const row = document.createElement('div');
      row.className = 'flex gap-2 items-center flex-wrap border border-slate-200 p-2 rounded bg-white';
      row.innerHTML = \`
        <span class="text-xs text-slate-600 font-medium">x:</span>
        <input type="number" class="point-x border border-slate-300 rounded p-1 text-sm w-16 focus:outline-blue-500" step="any" value="2">
        <span class="text-xs text-slate-600 font-medium">y:</span>
        <input type="number" class="point-y border border-slate-300 rounded p-1 text-sm w-16 focus:outline-blue-500" step="any" value="3">
        <span class="text-xs text-slate-600 font-medium">Tên:</span>
        <input type="text" class="point-name border border-slate-300 rounded p-1 text-sm w-16 focus:outline-blue-500" placeholder="e.g. M">
        <button type="button" onclick="this.closest('div.border').remove()" class="text-slate-400 hover:text-red-500 ml-auto" title="Xóa điểm này">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      \`;
      container.appendChild(row);
    }
`;

if (!html.includes('function addGraphPoint')) {
    html = html.replace('function addGraphFunction() {', addPointFunc + '\n    function addGraphFunction() {');
}

const drawPointsSnippet = `
      // Draw special points
      const pointRows = document.querySelectorAll('#graph-points-list > div');
      pointRows.forEach(row => {
          const pxVal = parseFloat(row.querySelector('.point-x').value);
          const pyVal = parseFloat(row.querySelector('.point-y').value);
          const pName = row.querySelector('.point-name').value;
          
          if (!isNaN(pxVal) && !isNaN(pyVal)) {
              const canvasX = originX + pxVal * scaleX;
              const canvasY = originY - pyVal * scaleY;
              
              const axisY = (yMin <= 0 && yMax >= 0) ? originY : (pyVal > 0 ? height : 0);
              const axisX = (xMin <= 0 && xMax >= 0) ? originX : (pxVal > 0 ? 0 : width);
              
              if (isFinite(canvasX) && isFinite(canvasY)) {
                  // Dashed line to X axis
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, axisY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis
                  objs.push(new fabric.Line([canvasX, canvasY, axisX, canvasY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  
                  // Point circle
                  objs.push(new fabric.Circle({ left: canvasX, top: canvasY, radius: 3, fill: '#1e293b', originX: 'center', originY: 'center' }));
                  
                  // Label
                  if (pName) {
                      objs.push(new fabric.Text(pName, { left: canvasX + 6, top: canvasY - 6, fontSize: 14, fill: '#1e293b', fontStyle: 'italic', fontFamily: 'Times New Roman', originX: 'left', originY: 'bottom' }));
                  }
              }
          }
      });
      
      if (objs.length > 0) {
`;

if (!html.includes('Draw special points')) {
    html = html.replace('if (objs.length > 0) {', drawPointsSnippet);
}

// Modify scale calculation in drawGraph
const scaleRegex = /const width = 400;\s*const height = \(yMax - yMin\) \/ \(xMax - xMin\) \* width;\s*if \(isNaN\(height\) \|\| height <= 0 \|\| !isFinite\(height\)\) \{[\s\S]*?const scaleY = height \/ \(yMax - yMin\);/;

const newScaleLogic = `const scaleUnit = parseFloat(document.getElementById('graph-scale')?.value) || 40;
      const width = (xMax - xMin) * scaleUnit;
      const height = (yMax - yMin) * scaleUnit;
      
      if (isNaN(width) || width <= 0 || !isFinite(width) || isNaN(height) || height <= 0 || !isFinite(height)) {
          showToast("Lỗi tính toán kích thước.");
          return;
      }
      
      const scaleX = scaleUnit;
      const scaleY = scaleUnit;`;

if (html.match(scaleRegex)) {
    html = html.replace(scaleRegex, newScaleLogic);
    console.log("Replaced scale logic");
} else {
    console.log("Could not find scale logic");
}

fs.writeFileSync('index.html', html);
