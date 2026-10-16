const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldHTML = `<div class="grid grid-cols-3 gap-4 border p-3 rounded bg-slate-50">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-slate-600">X Min</label>
            <input type="number" id="graph-xmin" value="-10" class="border p-1.5 rounded focus:outline-slate-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-slate-600">X Max</label>
            <input type="number" id="graph-xmax" value="10" class="border p-1.5 rounded focus:outline-slate-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-slate-600">Bước chia X (tick)</label>
            <input type="number" id="graph-xstep" value="2" min="0.1" class="border p-1.5 rounded focus:outline-slate-400" />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4 border p-3 rounded bg-slate-50">
          <div class="flex flex-col gap-1">
            <label class="font-bold text-slate-600">Y Min</label>
            <input type="number" id="graph-ymin" value="-10" class="border p-1.5 rounded focus:outline-slate-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-slate-600">Y Max</label>
            <input type="number" id="graph-ymax" value="10" class="border p-1.5 rounded focus:outline-slate-400" />
          </div>
          <div class="flex flex-col gap-1">
            <label class="font-bold text-slate-600">Bước chia Y (tick)</label>
            <input type="number" id="graph-ystep" value="2" min="0.1" class="border p-1.5 rounded focus:outline-slate-400" />
          </div>
        </div>`;

const newHTML = `<div class="grid grid-cols-1 gap-4 border p-3 rounded bg-slate-50">
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-600">X Min (Hệ tọa độ)</label>
              <input type="number" id="graph-xmin" value="-10" class="border p-1.5 rounded focus:outline-slate-400" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-600">X Max (Hệ tọa độ)</label>
              <input type="number" id="graph-xmax" value="10" class="border p-1.5 rounded focus:outline-slate-400" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-600">Bước chia X (tick)</label>
              <input type="number" id="graph-xstep" value="2" min="0.1" class="border p-1.5 rounded focus:outline-slate-400" />
            </div>
          </div>
          <div class="flex items-center gap-2 border-t pt-2 mt-1 border-slate-200">
            <label class="font-bold text-slate-600 text-sm whitespace-nowrap">Đoạn trục X hiển thị:</label>
            <span class="text-sm text-slate-500">Từ</span>
            <input type="number" id="graph-axis-x-draw-min" class="border p-1 rounded focus:outline-slate-400 w-24 text-sm" placeholder="Mặc định" step="any" />
            <span class="text-sm text-slate-500">đến</span>
            <input type="number" id="graph-axis-x-draw-max" class="border p-1 rounded focus:outline-slate-400 w-24 text-sm" placeholder="Mặc định" step="any" />
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 border p-3 rounded bg-slate-50">
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-600">Y Min (Hệ tọa độ)</label>
              <input type="number" id="graph-ymin" value="-10" class="border p-1.5 rounded focus:outline-slate-400" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-600">Y Max (Hệ tọa độ)</label>
              <input type="number" id="graph-ymax" value="10" class="border p-1.5 rounded focus:outline-slate-400" />
            </div>
            <div class="flex flex-col gap-1">
              <label class="font-bold text-slate-600">Bước chia Y (tick)</label>
              <input type="number" id="graph-ystep" value="2" min="0.1" class="border p-1.5 rounded focus:outline-slate-400" />
            </div>
          </div>
          <div class="flex items-center gap-2 border-t pt-2 mt-1 border-slate-200">
            <label class="font-bold text-slate-600 text-sm whitespace-nowrap">Đoạn trục Y hiển thị:</label>
            <span class="text-sm text-slate-500">Từ</span>
            <input type="number" id="graph-axis-y-draw-min" class="border p-1 rounded focus:outline-slate-400 w-24 text-sm" placeholder="Mặc định" step="any" />
            <span class="text-sm text-slate-500">đến</span>
            <input type="number" id="graph-axis-y-draw-max" class="border p-1 rounded focus:outline-slate-400 w-24 text-sm" placeholder="Mặc định" step="any" />
          </div>
        </div>`;

if (html.includes(oldHTML)) {
    html = html.replace(oldHTML, newHTML);
    console.log("Replaced grid UI block");
} else {
    console.log("Could not find grid UI block");
}

fs.writeFileSync('index.html', html);
