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
      </aside>
`;

// Find panel-graph start
let pGraphIndex = html.indexOf('<!-- Tab Đồ thị -->');
// Find end of panel-graph, which is right before </aside>
let asideEndIndex = html.indexOf('      </aside>');

let graphHtml = html.substring(pGraphIndex, asideEndIndex);

// Let's remove the bad graphHtml and extra tags from the main html
// Everything from </div> after panel-optics
// Actually, let's just find the exact text we want to replace.
let toReplace = html.substring(
  html.indexOf('          <div id="panel-optics" class="tab-panel hidden flex-col gap-6">'),
  html.indexOf('      <!-- Canvas Area -->')
);

const newReplacement = `          <div id="panel-optics" class="tab-panel hidden flex-col gap-6">
            <div class="text-center text-slate-400 text-[11px] py-10">Đang phát triển các đối tượng Quang học...</div>
          </div>
          
${graphHtml.replace('</div>\n          </div>\n        </div>', '</div>\n          </div>')}
        </div>
${instructionFooter}`;

html = html.replace(toReplace, newReplacement);

fs.writeFileSync('index.html', html);
console.log("Done");
