const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The instruction footer is:
const instructionFooter = `
        <div class="mt-auto p-4 border-t border-slate-200 bg-slate-50">
          <div class="text-xs text-slate-500 flex flex-col gap-1">
            <p>• <b>Click</b> để chọn vật thể.</p>
            <p>• <b>Kéo thả</b> để di chuyển.</p>
            <p>• Kéo các <b>điểm neo</b> để thu phóng, xoay.</p>
            <p>• <b>Alt + Kéo</b> để di chuyển vùng nhìn.</p>
            <p>• <b>Cuộn chuột</b> để phóng to/thu nhỏ.</p>
            <p>• Phím <b>Delete/Backspace</b> để xóa.</p>
          </div>
        </div>
`;

// Find panel-graph start
let pGraphIndex = html.indexOf('<!-- Tab Đồ thị -->');
// Find end of panel-graph, which is right before </aside>
let asideEndIndex = html.indexOf('      </aside>');

let graphHtml = html.substring(pGraphIndex, asideEndIndex);

// However, graphHtml currently includes a closing </div> for the footer.
// The actual end of panel-graph is the last </div> before </aside>
// Wait, the structure right now before </aside> is:
//             <div class="mt-4 pb-4">
//               <button onclick="drawGraph()" ...>VẼ ĐỒ THỊ LÊN BẢNG</button>
//             </div>
//           </div>
//         </div>
//       </aside>

let modifiedHtml = html.replace(
  /<div class="mt-auto p-4 border-t border-slate-200 bg-slate-50">[\s\S]*?<!-- Tab Đồ thị -->/,
  '<!-- Tab Đồ thị -->'
);
modifiedHtml = modifiedHtml.replace(
  '              <button onclick="drawGraph()" class="w-full py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 font-medium text-xs transition-colors shadow-sm">VẼ ĐỒ THỊ LÊN BẢNG</button>\n            </div>\n          </div>\n        </div>\n      </aside>',
  '              <button onclick="drawGraph()" class="w-full py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 font-medium text-xs transition-colors shadow-sm">VẼ ĐỒ THỊ LÊN BẢNG</button>\n            </div>\n          </div>\n        </div>\n' + instructionFooter + '      </aside>'
);

fs.writeFileSync('index.html', modifiedHtml);
console.log("Done");
