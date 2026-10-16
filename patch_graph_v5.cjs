const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<button onclick="addGraphFunction\(\)"[\s\S]*?Thêm hàm số[\s\S]*?<\/button>/;
const templatesHTML = `
          <div class="mt-2 flex flex-col gap-2">
              <div class="text-xs text-slate-500 font-medium">Mẫu hàm số nhanh:</div>
              <div class="flex gap-2 flex-wrap">
                  <button onclick="addFunctionTemplate('y', '(x+1)/(x-1)')" class="px-2 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs hover:bg-blue-100 transition-colors">Phân thức</button>
                  <button onclick="addFunctionTemplate('y', 'sqrt(x)')" class="px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded text-xs hover:bg-emerald-100 transition-colors">Vô tỉ (Căn)</button>
                  <button onclick="addFunctionTemplate('y', 'abs(x)')" class="px-2 py-1 bg-purple-50 text-purple-600 border border-purple-200 rounded text-xs hover:bg-purple-100 transition-colors">Trị tuyệt đối</button>
                  <button onclick="addFunctionTemplate('y', 'x > 0 ? x^2 : -x')" class="px-2 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded text-xs hover:bg-orange-100 transition-colors">Phân nhánh</button>
                  <button onclick="addFunctionTemplate('y', 'log(x)')" class="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-200 rounded text-xs hover:bg-rose-100 transition-colors">Lôgarit</button>
                  <button onclick="addFunctionTemplate('y', '2^x')" class="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded text-xs hover:bg-indigo-100 transition-colors">Mũ</button>
                  <button onclick="addGraphFunction()" class="px-2 py-1 bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs hover:bg-slate-200 transition-colors">+ Tùy chỉnh</button>
              </div>
          </div>
`;
if (html.match(regex)) {
    html = html.replace(regex, templatesHTML);
    console.log("Replaced add button with templates");
} else {
    console.log("Could not find addGraphFunction button");
}

const addFuncTemplateScript = `
    function addFunctionTemplate(type, expr) {
        addGraphFunction();
        const rows = document.querySelectorAll('#graph-functions-list > div');
        if (rows.length > 0) {
            const lastRow = rows[rows.length - 1];
            lastRow.querySelector('.func-type').value = type;
            lastRow.querySelector('.func-input').value = expr;
        }
    }
`;

if (!html.includes('addFunctionTemplate')) {
    html = html.replace('function addGraphFunction() {', addFuncTemplateScript + '\n    function addGraphFunction() {');
}

fs.writeFileSync('index.html', html);
