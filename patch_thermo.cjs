const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldHTML = `<div id="panel-thermodynamics" class="tab-panel hidden flex-col gap-6">
            <div class="flex flex-col gap-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Dụng cụ</div>
              <div class="grid grid-cols-2 gap-2">
                 <button onclick="addContainer()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Cốc / Bình chứa</button>
              </div>
            </div>
          </div>`;

const newHTML = `<div id="panel-thermodynamics" class="tab-panel hidden flex-col gap-6">
            <div class="flex flex-col gap-3">
              <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Dụng cụ</div>
              <div class="grid grid-cols-2 gap-2">
                 <button onclick="addContainer()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Cốc / Bình chứa</button>
                 <button onclick="addThermometer()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Nhiệt kế</button>
                 <button onclick="addAlcoholLamp()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Đèn cồn</button>
                 <button onclick="addCalorimeter()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Nhiệt lượng kế</button>
                 <button onclick="addTestTube()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Ống nghiệm</button>
                 <button onclick="addPistonCylinder()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Xilanh & Pít-tông</button>
                 <button onclick="addPressureGauge()" class="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-xs font-medium transition-colors">Đồng hồ áp suất</button>
              </div>
            </div>
          </div>`;

if (html.includes(oldHTML)) {
    html = html.replace(oldHTML, newHTML);
    console.log("Replaced thermo HTML");
} else {
    console.log("Could not find thermo HTML");
}

fs.writeFileSync('index.html', html);
