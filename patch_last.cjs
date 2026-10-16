const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldGridBlock = `<div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <input type="checkbox" id="graph-grid" class="w-4 h-4 cursor-pointer" checked />
          <label for="graph-grid" class="font-bold text-slate-600 cursor-pointer">Hiển thị ô lưới</label>
        </div>
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <label for="graph-scale" class="font-bold text-slate-600 whitespace-nowrap">Tỉ lệ (px/đv):</label>
          <input type="number" id="graph-scale" value="40" min="1" class="border p-1.5 rounded focus:outline-slate-400 w-full" />
        </div>
      </div>`;

const newGridBlock = `<div class="grid grid-cols-3 gap-4">
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <input type="checkbox" id="graph-grid" class="w-4 h-4 cursor-pointer" checked />
          <label for="graph-grid" class="font-bold text-slate-600 cursor-pointer">Hiển thị ô lưới</label>
        </div>
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <label for="graph-scale-x" class="font-bold text-slate-600 whitespace-nowrap">Tỉ lệ X:</label>
          <input type="number" id="graph-scale-x" value="40" min="1" class="border p-1.5 rounded focus:outline-slate-400 w-full" title="Tỉ lệ pixel trên 1 đơn vị trục X" />
        </div>
        <div class="flex items-center gap-2 border p-3 rounded bg-slate-50">
          <label for="graph-scale-y" class="font-bold text-slate-600 whitespace-nowrap">Tỉ lệ Y:</label>
          <input type="number" id="graph-scale-y" value="40" min="1" class="border p-1.5 rounded focus:outline-slate-400 w-full" title="Tỉ lệ pixel trên 1 đơn vị trục Y" />
        </div>
      </div>`;

if (html.includes(oldGridBlock)) {
    html = html.replace(oldGridBlock, newGridBlock);
    console.log("Replaced grid block");
} else {
    console.log("Could not find grid block");
}

fs.writeFileSync('index.html', html);
