const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexAddFunc = /function addGraphFunction\(\) \{[\s\S]*?lucide\.createIcons\(\);\s*\}/;
const newAddFunc = `function addGraphFunction() {
      const container = document.getElementById('graph-functions-list');
      if (!container) return;
      const row = document.createElement('div');
      row.className = 'flex flex-col gap-2 mb-2 border border-slate-200 p-2 rounded bg-slate-50';
      row.innerHTML = \`
        <div class="flex gap-2 items-center flex-wrap">
            <select class="func-type border border-slate-300 rounded p-1 text-sm outline-none">
              <option value="y">y =</option>
              <option value="x">x =</option>
            </select>
            <input type="text" class="func-input flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-blue-500 min-w-[120px]" placeholder="e.g. sin(x) hoặc x^2">
            
            <div class="flex items-center gap-1">
                <label class="text-xs text-slate-500">Màu:</label>
                <input type="color" class="func-color w-6 h-6 rounded cursor-pointer border-0 p-0" value="#ef4444">
            </div>
            <div class="flex items-center gap-1">
                <label class="text-xs text-slate-500">Nét:</label>
                <input type="number" class="func-weight border border-slate-300 rounded p-1 text-xs w-12 outline-none" value="2" min="1">
            </div>
            <div class="flex items-center gap-1">
                <label class="text-xs text-slate-500">Kiểu:</label>
                <select class="func-dash border border-slate-300 rounded p-1 text-xs outline-none">
                    <option value="solid">Liền</option>
                    <option value="dashed">Đứt</option>
                </select>
            </div>
            <button type="button" onclick="this.closest('div.border').remove()" class="text-slate-400 hover:text-red-500" title="Xóa hàm số này">
              <i data-lucide="x" class="w-4 h-4"></i>
            </button>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-500 bg-white p-1.5 rounded border border-slate-100">
            <span class="font-medium text-slate-600">Phạm vi:</span>
            <span>Từ</span>
            <input type="number" class="func-domain-min border border-slate-300 rounded p-1 w-16 outline-none" placeholder="Min" step="any">
            <span>đến</span>
            <input type="number" class="func-domain-max border border-slate-300 rounded p-1 w-16 outline-none" placeholder="Max" step="any">
            <span class="text-[10px] text-slate-400 italic">(Để trống nếu dùng trục mặc định)</span>
        </div>
      \`;
      container.appendChild(row);
      lucide.createIcons();
    }`;

if (html.match(regexAddFunc)) {
    html = html.replace(regexAddFunc, newAddFunc);
    console.log("Replaced addGraphFunction");
} else {
    console.log("Could not find addGraphFunction");
}

const regexDrawLoop = /const dash = row\.querySelector\('\.func-dash'\)\.value;[\s\S]*?for \(let px = 0; px <= width; px \+= 1\) \{/m;
const newDrawLoop = `const dash = row.querySelector('.func-dash').value;
        
        let customMinStr = row.querySelector('.func-domain-min') ? row.querySelector('.func-domain-min').value : '';
        let customMaxStr = row.querySelector('.func-domain-max') ? row.querySelector('.func-domain-max').value : '';
        let customMin = customMinStr !== '' ? parseFloat(customMinStr) : null;
        let customMax = customMaxStr !== '' ? parseFloat(customMaxStr) : null;
        if (isNaN(customMin)) customMin = null;
        if (isNaN(customMax)) customMax = null;
        
        if (!expr || !window.math) return;
        
        let processedExpr = expr.trim();
        if (type === 'y' && processedExpr.startsWith('y=')) processedExpr = processedExpr.substring(2);
        else if (type === 'y' && processedExpr.startsWith('y =')) processedExpr = processedExpr.substring(3);
        else if (type === 'x' && processedExpr.startsWith('x=')) processedExpr = processedExpr.substring(2);
        else if (type === 'x' && processedExpr.startsWith('x =')) processedExpr = processedExpr.substring(3);
        
        if (processedExpr.startsWith('f(x)=')) processedExpr = processedExpr.substring(5);
        else if (processedExpr.startsWith('f(x) =')) processedExpr = processedExpr.substring(6);
        
        processedExpr = processedExpr.replace(/\\*\\*/g, '^');
        
        const dashArray = dash === 'dashed' ? [weight * 3, weight * 3] : null;
        
        let pDataStr = "";
        let isDrawing = false;
        let prevPx = null;
        let prevPy = null;
        let prevVal = null;
        
        try {
            const compiled = math.compile(processedExpr);
            
            if (type === 'y') {
                let startPx = 0;
                let endPx = width;
                if (customMin !== null) startPx = originX + customMin * scaleX;
                if (customMax !== null) endPx = originX + customMax * scaleX;
                startPx = Math.max(0, Math.floor(startPx));
                endPx = Math.min(width, Math.ceil(endPx));
                
                for (let px = startPx; px <= endPx; px += 1) {
                  const x = (px - originX) / scaleX;
                  if (customMin !== null && x < customMin) continue;
                  if (customMax !== null && x > customMax) continue;`;

if (html.match(regexDrawLoop)) {
    html = html.replace(regexDrawLoop, newDrawLoop);
    console.log("Replaced Y loop start");
} else {
    console.log("Could not find Y loop start");
}

const regexDrawXLoop = /\} else \{[\s\S]*?for \(let py = 0; py <= height; py \+= 1\) \{/m;
const newDrawXLoop = `} else {
                let startPy = 0;
                let endPy = height;
                if (customMax !== null) startPy = originY - customMax * scaleY;
                if (customMin !== null) endPy = originY - customMin * scaleY;
                startPy = Math.max(0, Math.floor(startPy));
                endPy = Math.min(height, Math.ceil(endPy));
                
                for (let py = startPy; py <= endPy; py += 1) {
                  const y = (originY - py) / scaleY;
                  if (customMin !== null && y < customMin) continue;
                  if (customMax !== null && y > customMax) continue;`;

if (html.match(regexDrawXLoop)) {
    html = html.replace(regexDrawXLoop, newDrawXLoop);
    console.log("Replaced X loop start");
} else {
    console.log("Could not find X loop start");
}

fs.writeFileSync('index.html', html);
