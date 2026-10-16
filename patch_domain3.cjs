const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexAddFunc = /function addGraphFunction\(\) \{[\s\S]*?container\.appendChild\(row\);\s*\}/;
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
            <button type="button" onclick="this.closest('div.border').remove()" class="text-red-500 hover:text-red-700 ml-auto" title="Xóa hàm số này">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
        </div>
        <div class="flex items-center gap-2 text-xs text-slate-500 bg-white p-1.5 rounded border border-slate-100">
            <span class="font-medium text-slate-600">Phạm vi vẽ:</span>
            <span>Từ</span>
            <input type="number" class="func-domain-min border border-slate-300 rounded p-1 w-16 outline-none" placeholder="Min" step="any">
            <span>đến</span>
            <input type="number" class="func-domain-max border border-slate-300 rounded p-1 w-16 outline-none" placeholder="Max" step="any">
            <span class="text-[10px] text-slate-400 italic">(Để trống nếu vẽ trên toàn bộ hệ trục)</span>
        </div>
      \`;
      container.appendChild(row);
    }`;

if (html.match(regexAddFunc)) {
    html = html.replace(regexAddFunc, newAddFunc);
    console.log("Replaced addGraphFunction");
} else {
    console.log("Could not find addGraphFunction");
}

fs.writeFileSync('index.html', html);
