const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove water from Overflow Can and Container
html = html.replace(`const liquid = new fabric.Path('M -27.5 -30 L -27.5 50 A 2.5 2.5 0 0 0 -25 52.5 L 25 52.5 A 2.5 2.5 0 0 0 27.5 50 L 27.5 -30 Z', {
        fill: '#bae6fd', opacity: 0.7
      });
      const waterLevel = new fabric.Line([-27.5, -30, 27.5, -30], {
        stroke: '#0ea5e9', strokeWidth: 2
      });`, ``).replace(`const group = new fabric.Group([liquid, waterLevel, bodyPath, spout, ...marks]`, `const group = new fabric.Group([bodyPath, spout, ...marks]`);

html = html.replace(`const liquid = new fabric.Path('M -27 -10 L -27 40 A 7 7 0 0 0 -20 47 L 20 47 A 7 7 0 0 0 27 40 L 27 -10 Z', {
        fill: '#60a5fa', opacity: 0.6
      });`, ``).replace(`const group = new fabric.Group([liquid, beaker]`, `const group = new fabric.Group([beaker]`);

// 2. Text controls (font & color)
html = html.replace(`            <div id="textControls" class="flex items-center gap-1">
              <button onclick="toggleTextBold()" id="btnTextBold" class="w-7 h-7 font-bold hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">B</button>`, `            <div id="textControls" class="flex items-center gap-1">
              <select id="fontFamilySelect" onchange="changeTextFont(this.value)" class="h-7 border border-slate-300 rounded px-1 text-xs focus:outline-slate-400 max-w-[80px]">
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
              </select>
              <input type="color" id="textColorInput" onchange="changeTextColor(this.value)" class="w-7 h-7 p-0 border-0 cursor-pointer rounded" title="Màu chữ" />
              <button onclick="toggleTextBold()" id="btnTextBold" class="w-7 h-7 font-bold hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">B</button>`);

html = html.replace(`const btnTextItalic = document.getElementById('btnTextItalic');`, `const btnTextItalic = document.getElementById('btnTextItalic');
    const fontFamilySelect = document.getElementById('fontFamilySelect');
    const textColorInput = document.getElementById('textColorInput');`);

html = html.replace(`          btnTextItalic.style.backgroundColor = obj.fontStyle === 'italic' ? '#e2e8f0' : '';
          fontSizeInput.value = obj.fontSize;`, `          btnTextItalic.style.backgroundColor = obj.fontStyle === 'italic' ? '#e2e8f0' : '';
          fontSizeInput.value = obj.fontSize;
          fontFamilySelect.value = obj.fontFamily || 'sans-serif';
          textColorInput.value = obj.fill || '#000000';`);
          
const fontJs = `
    window.changeTextFont = function(val) {
      const obj = canvas.getActiveObject();
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        obj.set('fontFamily', val);
        canvas.renderAll();
        updateFloatingToolbar();
      }
    };
    window.changeTextColor = function(val) {
      const obj = canvas.getActiveObject();
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        obj.set('fill', val);
        canvas.renderAll();
        updateFloatingToolbar();
      }
    };
`;
html = html.replace(`    window.changeTextFontSize = function(val) {`, fontJs + `    window.changeTextFontSize = function(val) {`);


// 3. Move Graph to new tab
const graphTabBtn = `          <button onclick="switchTab('optics')" id="tab-optics" class="tab-btn flex-1 py-2 text-[10px] uppercase font-bold text-center transition-colors text-slate-400 hover:bg-slate-50 border-b-2 border-transparent">Quang</button>
          <button onclick="switchTab('graph')" id="tab-graph" class="tab-btn flex-1 py-2 text-[10px] uppercase font-bold text-center transition-colors text-slate-400 hover:bg-slate-50 border-b-2 border-transparent">Đồ thị</button>`;
html = html.replace(`<button onclick="switchTab('optics')" id="tab-optics" class="tab-btn flex-1 py-2 text-[10px] uppercase font-bold text-center transition-colors text-slate-400 hover:bg-slate-50 border-b-2 border-transparent">Quang</button>`, graphTabBtn);

html = html.replace(`                 <button onclick="openGraphDialog()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Vẽ Đồ thị Hàm số</button>`, ``);

const graphPanelContent = `
          <!-- Tab Đồ thị -->
          <div id="panel-graph" class="tab-panel hidden flex-col gap-4">
            <div class="flex flex-col gap-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Nhãn trục</div>
              <div class="grid grid-cols-2 gap-2">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600 font-medium">Trục X</label>
                  <input type="text" id="graph-xlabel" value="x" class="border p-1.5 rounded focus:outline-slate-400 text-xs" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600 font-medium">Trục Y</label>
                  <input type="text" id="graph-ylabel" value="y" class="border p-1.5 rounded focus:outline-slate-400 text-xs" />
                </div>
              </div>
            </div>
            
            <div class="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Hệ tọa độ</div>
              <div class="grid grid-cols-3 gap-2">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600">X Min</label>
                  <input type="number" id="graph-xmin" value="-10" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600">X Max</label>
                  <input type="number" id="graph-xmax" value="10" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600">Bước X</label>
                  <input type="number" id="graph-xstep" value="2" min="0.1" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-2 mt-1">
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600">Y Min</label>
                  <input type="number" id="graph-ymin" value="-10" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600">Y Max</label>
                  <input type="number" id="graph-ymax" value="10" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-[10px] text-slate-600">Bước Y</label>
                  <input type="number" id="graph-ystep" value="2" min="0.1" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Đoạn hiển thị đồ thị (Tùy chọn)</div>
              <div class="grid grid-cols-2 gap-2">
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] text-slate-500">X từ</span>
                    <input type="number" id="graph-axis-x-draw-min" class="border p-1 rounded focus:outline-slate-400 flex-1 text-xs w-10" placeholder="Mặc định" step="any" />
                    <span class="text-[10px] text-slate-500">đến</span>
                    <input type="number" id="graph-axis-x-draw-max" class="border p-1 rounded focus:outline-slate-400 flex-1 text-xs w-10" placeholder="Mặc định" step="any" />
                  </div>
                  <div class="flex items-center gap-1">
                    <span class="text-[10px] text-slate-500">Y từ</span>
                    <input type="number" id="graph-axis-y-draw-min" class="border p-1 rounded focus:outline-slate-400 flex-1 text-xs w-10" placeholder="Mặc định" step="any" />
                    <span class="text-[10px] text-slate-500">đến</span>
                    <input type="number" id="graph-axis-y-draw-max" class="border p-1 rounded focus:outline-slate-400 flex-1 text-xs w-10" placeholder="Mặc định" step="any" />
                  </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Cấu hình khác</div>
              <div class="flex items-center gap-2">
                <input type="checkbox" id="graph-grid" class="w-3 h-3 cursor-pointer" checked />
                <label for="graph-grid" class="text-[10px] text-slate-600 cursor-pointer">Hiển thị ô lưới</label>
              </div>
              <div class="grid grid-cols-2 gap-2 mt-1">
                <div class="flex flex-col gap-1">
                  <label for="graph-scale-x" class="text-[10px] text-slate-600">Tỉ lệ X (px/đơn vị)</label>
                  <input type="number" id="graph-scale-x" value="40" min="1" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
                <div class="flex flex-col gap-1">
                  <label for="graph-scale-y" class="text-[10px] text-slate-600">Tỉ lệ Y (px/đơn vị)</label>
                  <input type="number" id="graph-scale-y" value="40" min="1" class="border p-1 rounded text-xs focus:outline-slate-400" />
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm đặc biệt (nét đứt)</div>
              <div id="graph-points-list" class="flex flex-col gap-2"></div>
              <button onclick="addGraphPoint()" class="self-start px-2 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded text-[10px] font-medium hover:bg-slate-200 transition-colors">+ Thêm điểm</button>
            </div>

            <div class="flex flex-col gap-2 border-t border-slate-200 pt-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Các hàm số</div>
              <div id="graph-functions-list" class="flex flex-col gap-2"></div>
              
              <div class="mt-1 flex flex-col gap-1">
                <div class="text-[10px] text-slate-500 font-medium">Mẫu hàm số nhanh:</div>
                <div class="flex gap-1 flex-wrap">
                  <button onclick="addFunctionTemplate('y', '(x+1)/(x-1)')" class="px-1.5 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded text-[10px] hover:bg-blue-100 transition-colors">Phân thức</button>
                  <button onclick="addFunctionTemplate('y', 'sqrt(x)')" class="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-[10px] hover:bg-emerald-100 transition-colors">Vô tỉ (Căn)</button>
                  <button onclick="addFunctionTemplate('y', 'abs(x)')" class="px-1.5 py-0.5 bg-purple-50 text-purple-600 border border-purple-200 rounded text-[10px] hover:bg-purple-100 transition-colors">Trị tuyệt đối</button>
                  <button onclick="addFunctionTemplate('y', 'x > 0 ? x^2 : -x')" class="px-1.5 py-0.5 bg-orange-50 text-orange-600 border border-orange-200 rounded text-[10px] hover:bg-orange-100 transition-colors">Phân nhánh</button>
                  <button onclick="addFunctionTemplate('y', 'log(x)')" class="px-1.5 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded text-[10px] hover:bg-rose-100 transition-colors">Lôgarit</button>
                  <button onclick="addFunctionTemplate('y', '2^x')" class="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded text-[10px] hover:bg-indigo-100 transition-colors">Mũ</button>
                  <button onclick="addGraphFunction()" class="px-1.5 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded text-[10px] hover:bg-slate-200 transition-colors">+ Tùy chỉnh</button>
                </div>
              </div>
            </div>

            <div class="mt-4 pb-4">
              <button onclick="drawGraph()" class="w-full py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 font-medium text-xs transition-colors shadow-sm">VẼ ĐỒ THỊ LÊN BẢNG</button>
            </div>
          </div>
`;

html = html.replace(`        </div>
      </aside>`, graphPanelContent + `\n        </div>\n      </aside>`);

// Remove modal HTML
const modalStartIdx = html.indexOf(`<div id="graphModal"`);
const scriptIdx = html.indexOf(`<script>`);
if (modalStartIdx !== -1 && scriptIdx !== -1) {
    html = html.substring(0, modalStartIdx) + html.substring(scriptIdx);
}

// Remove open/close graph dialog functions
html = html.replace(`    function openGraphDialog() {
      document.getElementById('graphModal').classList.remove('hidden');
    }
    
    function closeGraphDialog() {
      document.getElementById('graphModal').classList.add('hidden');
    }`, ``);

html = html.replace(`closeGraphDialog();`, `// Graph created`);

fs.writeFileSync('index.html', html);
console.log("Patched successfully!");
