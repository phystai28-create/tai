const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldFn = `    function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-slate-700', 'text-white');
        el.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
      });
      document.getElementById('tab-' + tabId).classList.remove('hidden');
      const activeBtn = document.querySelector(\`[onclick="switchTab('\${tabId}')"]\`);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
        activeBtn.classList.add('bg-slate-700', 'text-white');
      }
    }`;

const newFn = `    function switchTab(tabId) {
      document.querySelectorAll('.tab-panel').forEach(el => {
        el.classList.remove('flex');
        el.classList.add('hidden');
      });
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-slate-100', 'text-slate-800', 'border-slate-800');
        el.classList.add('text-slate-400', 'hover:bg-slate-50', 'border-transparent');
      });
      const panel = document.getElementById('panel-' + tabId);
      if (panel) {
        panel.classList.remove('hidden');
        panel.classList.add('flex');
      }
      const activeBtn = document.getElementById('tab-' + tabId);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'hover:bg-slate-50', 'border-transparent');
        activeBtn.classList.add('bg-slate-100', 'text-slate-800', 'border-slate-800');
      }
    }`;

if (html.includes(oldFn)) {
    html = html.replace(oldFn, newFn);
    console.log("Replaced switchTab");
} else {
    console.log("Could not find switchTab");
}

fs.writeFileSync('index.html', html);
