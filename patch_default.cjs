const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const defaultRow = `
                <div class="flex flex-col gap-2 border border-slate-200 p-2 rounded bg-white">
                  <div class="flex gap-2 items-center flex-wrap">
                      <select class="func-type border border-slate-300 rounded p-1 text-sm outline-none">
                          <option value="y">y = f(x)</option>
                          <option value="x">x = f(y)</option>
                      </select>
                      <div class="flex-1 min-w-[120px] flex items-center border border-slate-300 rounded focus-within:border-blue-500 bg-white">
                          <input type="text" class="func-input w-full border-none bg-transparent px-2 py-1 text-sm outline-none" placeholder="e.g. sin(x+π) hoặc x^2">
                          <button type="button" onclick="this.previousElementSibling.value += 'π'; this.previousElementSibling.focus();" class="px-2 text-slate-500 hover:text-slate-800 font-serif font-bold border-l border-slate-200" title="Chèn số Pi">π</button>
                      </div>
                  </div>
                  <div class="flex items-center gap-3 flex-wrap">
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
                      <span class="text-[10px]">từ</span>
                      <input type="number" class="func-domain-min border border-slate-300 rounded p-1 w-16 outline-none" placeholder="Min" step="any">
                      <span class="text-[10px]">đến</span>
                      <input type="number" class="func-domain-max border border-slate-300 rounded p-1 w-16 outline-none" placeholder="Max" step="any">
                      <span class="text-[10px] text-slate-400 italic">(Để trống nếu vẽ trên toàn bộ hệ trục)</span>
                  </div>
                </div>`;

html = html.replace('<div id="graph-functions-list" class="flex flex-col gap-2"></div>', '<div id="graph-functions-list" class="flex flex-col gap-2">' + defaultRow + '</div>');
fs.writeFileSync('index.html', html);
