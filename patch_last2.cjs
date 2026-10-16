const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldPointFunc = `
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
    }`;

const newPointFunc = `
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
        <label class="flex items-center gap-1 text-xs text-slate-600 cursor-pointer ml-2 border-l border-slate-200 pl-3">
          <input type="checkbox" class="point-show-dot w-3 h-3" checked> Hiện chấm
        </label>
        <button type="button" onclick="this.closest('div.border').remove()" class="text-slate-400 hover:text-red-500 ml-auto" title="Xóa điểm này">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      \`;
      container.appendChild(row);
    }`;

if (html.includes(oldPointFunc)) {
    html = html.replace(oldPointFunc, newPointFunc);
    console.log("Replaced addGraphPoint");
} else {
    console.log("Could not find addGraphPoint");
}

const oldDrawPoint = `              if (isFinite(canvasX) && isFinite(canvasY)) {
                  // Dashed line to X axis (y = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, originY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis (x = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, originX, canvasY], { stroke: '#64748b', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  
                  // Point circle
                  objs.push(new fabric.Circle({ left: canvasX, top: canvasY, radius: 3, fill: '#1e293b', originX: 'center', originY: 'center' }));`;

const newDrawPoint = `              if (isFinite(canvasX) && isFinite(canvasY)) {
                  // Dashed line to X axis (y = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, canvasX, originY], { stroke: '#000000', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  // Dashed line to Y axis (x = 0)
                  objs.push(new fabric.Line([canvasX, canvasY, originX, canvasY], { stroke: '#000000', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
                  
                  // Point circle
                  const showDotCheckbox = row.querySelector('.point-show-dot');
                  const showDot = showDotCheckbox ? showDotCheckbox.checked : true;
                  if (showDot) {
                      objs.push(new fabric.Circle({ left: canvasX, top: canvasY, radius: 3, fill: '#000000', originX: 'center', originY: 'center' }));
                  }`;

if (html.includes(oldDrawPoint)) {
    html = html.replace(oldDrawPoint, newDrawPoint);
    console.log("Replaced draw graph point logic");
} else {
    console.log("Could not find draw graph point logic");
}

const oldScaleCalc = `      const scaleUnit = parseFloat(document.getElementById('graph-scale')?.value) || 40;
      const width = (xMax - xMin) * scaleUnit;
      const height = (yMax - yMin) * scaleUnit;
      
      if (isNaN(width) || width <= 0 || !isFinite(width) || isNaN(height) || height <= 0 || !isFinite(height)) {
          showToast("Lỗi tính toán kích thước.");
          return;
      }
      
      const scaleX = scaleUnit;
      const scaleY = scaleUnit;`;

const newScaleCalc = `      const scaleX = parseFloat(document.getElementById('graph-scale-x')?.value) || 40;
      const scaleY = parseFloat(document.getElementById('graph-scale-y')?.value) || 40;
      const width = (xMax - xMin) * scaleX;
      const height = (yMax - yMin) * scaleY;
      
      if (isNaN(width) || width <= 0 || !isFinite(width) || isNaN(height) || height <= 0 || !isFinite(height)) {
          showToast("Lỗi tính toán kích thước.");
          return;
      }`;

if (html.includes(oldScaleCalc)) {
    html = html.replace(oldScaleCalc, newScaleCalc);
    console.log("Replaced scale calculation logic");
} else {
    console.log("Could not find scale calculation logic");
}

fs.writeFileSync('index.html', html);
