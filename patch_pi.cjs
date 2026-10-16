const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Update input in addGraphFunction
const oldInput = `<input type="text" class="func-input flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-blue-500 min-w-[120px]" placeholder="e.g. sin(x) hoặc x^2">`;
const newInput = `<div class="flex-1 min-w-[120px] flex items-center border border-slate-300 rounded focus-within:border-blue-500 bg-white">
                <input type="text" class="func-input w-full border-none bg-transparent px-2 py-1 text-sm outline-none" placeholder="e.g. sin(x+π) hoặc x^2">
                <button type="button" onclick="this.previousElementSibling.value += 'π'; this.previousElementSibling.focus();" class="px-2 text-slate-500 hover:text-slate-800 font-serif font-bold border-l border-slate-200" title="Chèn số Pi">π</button>
            </div>`;

if (html.includes(oldInput)) {
    html = html.replace(oldInput, newInput);
    console.log("Replaced input in addGraphFunction");
} else {
    console.log("Could not find input to replace in addGraphFunction");
}

// Update expression processing
const oldExprProc = `processedExpr = processedExpr.replace(/\\*\\*/g, '^');`;
const newExprProc = `processedExpr = processedExpr.replace(/\\*\\*/g, '^');
        processedExpr = processedExpr.replace(/π/g, 'pi');`;

if (html.includes(oldExprProc)) {
    html = html.replace(oldExprProc, newExprProc);
    console.log("Replaced expression processing");
} else {
    console.log("Could not find expression processing");
}

fs.writeFileSync('index.html', html);
