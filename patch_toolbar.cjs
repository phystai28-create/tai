const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldToolbarUI = `          <div id="textToolbar" class="absolute bg-white border border-slate-200 shadow-md p-1 rounded hidden z-50 flex items-center gap-1">
            <button onclick="toggleTextBold()" id="btnTextBold" class="w-7 h-7 font-bold hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">B</button>
            <button onclick="toggleTextItalic()" id="btnTextItalic" class="w-7 h-7 italic font-serif hover:bg-slate-100 rounded text-sm transition-colors border border-transparent">I</button>
            <input type="number" id="fontSizeInput" onchange="changeTextFontSize(this.value)" class="w-14 h-7 border border-slate-300 rounded px-1 text-xs text-center focus:outline-slate-400" title="Cỡ chữ" />
          </div>`;

const newToolbarUI = `          <div id="floatingToolbar" class="absolute bg-white border border-slate-200 shadow-md p-1 rounded hidden z-50 flex items-center gap-1">
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
          </div>`;

if (html.includes(oldToolbarUI)) {
    html = html.replace(oldToolbarUI, newToolbarUI);
    console.log("Replaced toolbar UI");
} else {
    console.log("Could not find toolbar UI");
}

fs.writeFileSync('index.html', html);
