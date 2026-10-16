const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// The exact string in index.html right now is:
//             <div class="mt-4 pb-4">
//               <button onclick="drawGraph()" class="w-full py-2 bg-slate-800 text-white rounded-md hover:bg-slate-700 font-medium text-xs transition-colors shadow-sm">VẼ ĐỒ THỊ LÊN BẢNG</button>
//             </div>
//           </div>
//         </div>
//         </div>
//         <div class="mt-auto p-4 border-t border-slate-200 bg-slate-50">

// We need to remove one of those </div>s.
html = html.replace(
  '            </div>\n          </div>\n        </div>\n        </div>\n        <div class="mt-auto',
  '            </div>\n          </div>\n        </div>\n        <div class="mt-auto'
);

fs.writeFileSync('index.html', html);
console.log("Done");
