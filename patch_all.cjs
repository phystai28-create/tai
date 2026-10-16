const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update 3D shapes to transparent
html = html.replace(`const circleFill = new fabric.Circle({
        left: 0, top: 0, radius: w/2,
        fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center'
      });`, `const circleFill = new fabric.Circle({
        left: 0, top: 0, radius: w/2,
        fill: 'transparent', strokeWidth: 0, originX: 'center', originY: 'center'
      });`);

html = html.replace(`const bottomFill = new fabric.Ellipse({ 
        left: 0, top: h/2, rx: w/2, ry: ry, 
        fill: '#ffffff', originX: 'center', originY: 'center', strokeWidth: 0 
      });
      
      const bodyFill = new fabric.Rect({ 
        left: 0, top: 0, width: w, height: h, 
        fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const topEllipse = new fabric.Ellipse({ 
        left: 0, top: -h/2, rx: w/2, ry: ry, 
        fill: '#ffffff', stroke: '#0f172a', strokeWidth: 2, 
        originX: 'center', originY: 'center' 
      });`, `const bottomFill = new fabric.Ellipse({ 
        left: 0, top: h/2, rx: w/2, ry: ry, 
        fill: 'transparent', originX: 'center', originY: 'center', strokeWidth: 0 
      });
      
      const bodyFill = new fabric.Rect({ 
        left: 0, top: 0, width: w, height: h, 
        fill: 'transparent', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const topEllipse = new fabric.Ellipse({ 
        left: 0, top: -h/2, rx: w/2, ry: ry, 
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, 
        originX: 'center', originY: 'center' 
      });`);

html = html.replace(`const bottomFill = new fabric.Ellipse({ 
        left: 0, top: 0, rx: w/2, ry: ry, 
        fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const domeFill = new fabric.Path(\`M \${-w/2} 0 A \${w/2} \${h} 0 0 1 \${w/2} 0\`, {
        left: 0, top: -h/2, fill: '#ffffff', strokeWidth: 0, originX: 'center', originY: 'center'
      });`, `const bottomFill = new fabric.Ellipse({ 
        left: 0, top: 0, rx: w/2, ry: ry, 
        fill: 'transparent', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const domeFill = new fabric.Path(\`M \${-w/2} 0 A \${w/2} \${h} 0 0 1 \${w/2} 0\`, {
        left: 0, top: -h/2, fill: 'transparent', strokeWidth: 0, originX: 'center', originY: 'center'
      });`);

// 2. Change Cart color
html = html.replace(`function addCart() {
      const body = new fabric.Rect({ width: 80, height: 40, fill: '#3b82f6', stroke: '#1e3a8a', strokeWidth: 2, rx: 5, ry: 5, left: -40, top: -30 });`, `function addCart() {
      const body = new fabric.Rect({ width: 80, height: 40, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2, rx: 5, ry: 5, left: -40, top: -30 });`);

// 3. Update Pulley
html = html.replace(`function addPulley() {
      const ceiling = new fabric.Rect({ left: -60, top: -50, width: 120, height: 10, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const mount = new fabric.Rect({ left: -8, top: -40, width: 16, height: 45, fill: '#e2e8f0', stroke: '#475569', strokeWidth: 2 });
      const stringL = new fabric.Line([-30, 0, -30, 120], { stroke: '#000000', strokeWidth: 3 });
      const stringR = new fabric.Line([30, 0, 30, 120], { stroke: '#000000', strokeWidth: 3 });
      const stringArc = new fabric.Path('M -30 0 A 30 30 0 0 1 30 0', { fill: 'transparent', stroke: '#000000', strokeWidth: 3 });
      const wheel = new fabric.Circle({ radius: 30, fill: '#94a3b8', stroke: '#475569', strokeWidth: 3, left: -30, top: -30 });
      const dot = new fabric.Circle({ radius: 4, fill: '#0f172a', left: -4, top: -4 });
      
      const group = new fabric.Group([stringL, stringR, stringArc, wheel, mount, dot, ceiling], { left: 400, top: 300, originX: 'center', originY: 'center' });`, `function addPulley() {
      const ceiling = new fabric.Rect({ left: -60, top: -50, width: 120, height: 10, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const mount = new fabric.Rect({ left: -8, top: -40, width: 16, height: 45, fill: '#e2e8f0', stroke: '#475569', strokeWidth: 2 });
      const wheel = new fabric.Circle({ radius: 30, fill: '#94a3b8', stroke: '#475569', strokeWidth: 3, left: -30, top: -30 });
      const dot = new fabric.Circle({ radius: 4, fill: '#0f172a', left: -4, top: -4 });
      
      const group = new fabric.Group([wheel, mount, dot, ceiling], { left: 400, top: 300, originX: 'center', originY: 'center' });`);

// 4. Update floating toolbar HTML
html = html.replace(`          <div id="floatingToolbar" class="absolute bg-white border border-slate-200 shadow-md p-1 rounded hidden z-50 flex items-center gap-1">
            <div id="textControls" class="flex items-center gap-1">
              <button onclick="toggleTextBold()" id="btnTextBold" class="w-7 h-7 font-bold hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">B</button>
              <button onclick="toggleTextItalic()" id="btnTextItalic" class="w-7 h-7 italic font-serif hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">I</button>
              <input type="number" id="fontSizeInput" onchange="changeTextFontSize(this.value)" class="w-14 h-7 border border-slate-300 rounded px-1 text-xs text-center focus:outline-slate-400" title="Cỡ chữ" />
            </div>
            
            <div id="shapeControls" class="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1">
              <label class="text-[10px] text-slate-500 font-medium">Viền:</label>
              <input type="number" id="strokeWidthInput" onchange="changeStrokeWidth(this.value)" class="w-12 h-7 border border-slate-300 rounded px-1 text-xs text-center focus:outline-slate-400" title="Độ đậm viền" step="0.5" min="0" />
            </div>
            
            <div class="flex items-center gap-1 border-l border-slate-200 pl-1 ml-1">
              <button onclick="bringForward()" class="w-7 h-7 hover:bg-slate-100 rounded text-sm transition-colors border border-transparent flex items-center justify-center text-slate-600" title="Đưa lên trên 1 lớp">
                <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
              <button onclick="sendBackward()" class="w-7 h-7 hover:bg-slate-100 rounded text-sm transition-colors border border-transparent flex items-center justify-center text-slate-600" title="Đưa xuống dưới 1 lớp">
                <span class="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
            </div>
          </div>`, `          <div id="floatingToolbar" class="absolute bg-white border border-slate-200 shadow-md p-1 rounded hidden z-50 flex items-center gap-1">
            <div id="textControls" class="flex items-center gap-1">
              <button onclick="toggleTextBold()" id="btnTextBold" class="w-7 h-7 font-bold hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">B</button>
              <button onclick="toggleTextItalic()" id="btnTextItalic" class="w-7 h-7 italic font-serif hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">I</button>
              <input type="number" id="fontSizeInput" onchange="changeTextFontSize(this.value)" class="w-14 h-7 border border-slate-300 rounded px-1 text-xs text-center focus:outline-slate-400" title="Cỡ chữ" />
            </div>
          </div>`);

// 5. Add controls to top nav
const topControls = `
        <div id="topShapeControls" class="flex items-center gap-2 border-l border-slate-600 pl-3 ml-1" style="display: none;">
          <label class="text-xs text-slate-300 font-medium">Viền:</label>
          <input type="number" id="strokeWidthInputTop" onchange="changeStrokeWidth(this.value)" class="w-12 h-8 bg-slate-700 border border-slate-600 rounded px-1 text-xs text-center text-white focus:outline-slate-400" title="Độ đậm viền" step="0.5" min="0" />
          <button onclick="bringForward()" class="bg-blue-500/20 hover:bg-blue-500/40 text-blue-100 w-8 h-8 rounded-md transition-colors text-sm font-semibold flex items-center justify-center" title="Đưa lên trên 1 lớp">
            <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
          </button>
          <button onclick="sendBackward()" class="bg-blue-500/20 hover:bg-blue-500/40 text-blue-100 w-8 h-8 rounded-md transition-colors text-sm font-semibold flex items-center justify-center" title="Đưa xuống dưới 1 lớp">
            <span class="material-symbols-outlined text-[16px]">arrow_downward</span>
          </button>
        </div>`;

html = html.replace(`        <button onclick="clearCanvas()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold">
          Xóa Bảng`, topControls + `\n        <button onclick="clearCanvas()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold">\n          Xóa Bảng`);

// 6. Update JS logic for floatingToolbar
html = html.replace(`const shapeControls = document.getElementById('shapeControls');`, `const topShapeControls = document.getElementById('topShapeControls');`);
html = html.replace(`const strokeWidthInput = document.getElementById('strokeWidthInput');`, `const strokeWidthInputTop = document.getElementById('strokeWidthInputTop');`);

html = html.replace(`      if (isText) {
          textControls.style.display = 'flex';
          shapeControls.style.display = 'none';
          btnTextBold.style.backgroundColor = obj.fontWeight === 'bold' ? '#e2e8f0' : '';
          btnTextItalic.style.backgroundColor = obj.fontStyle === 'italic' ? '#e2e8f0' : '';
          fontSizeInput.value = obj.fontSize;
      } else {
          textControls.style.display = 'none';
          shapeControls.style.display = 'flex';
          strokeWidthInput.value = obj.strokeWidth || 0;
      }

      const bound = obj.getBoundingRect();
      floatingToolbar.style.left = (bound.left + bound.width / 2) + 'px';
      floatingToolbar.style.top = (bound.top - 10) + 'px';
      floatingToolbar.style.transform = 'translate(-50%, -100%)';`, `      if (isText) {
          textControls.style.display = 'flex';
          topShapeControls.style.display = 'none';
          btnTextBold.style.backgroundColor = obj.fontWeight === 'bold' ? '#e2e8f0' : '';
          btnTextItalic.style.backgroundColor = obj.fontStyle === 'italic' ? '#e2e8f0' : '';
          fontSizeInput.value = obj.fontSize;
          
          const bound = obj.getBoundingRect();
          floatingToolbar.style.left = (bound.left + bound.width / 2) + 'px';
          floatingToolbar.style.top = (bound.top - 10) + 'px';
          floatingToolbar.style.transform = 'translate(-50%, -100%)';
      } else {
          textControls.style.display = 'none';
          floatingToolbar.style.display = 'none';
          topShapeControls.style.display = 'flex';
          strokeWidthInputTop.value = obj.strokeWidth || 0;
      }`);
      
html = html.replace(`      if (!obj) {
        floatingToolbar.style.display = 'none';
        return;
      }`, `      if (!obj) {
        floatingToolbar.style.display = 'none';
        if (topShapeControls) topShapeControls.style.display = 'none';
        return;
      }`);

fs.writeFileSync('index.html', html);
console.log("Done");
