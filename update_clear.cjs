const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldBtn = '<button onclick="clearCanvas()" class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold">\n          Xóa Bảng\n        </button>';
const newBtn = '<button onclick="clearCanvas()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors text-sm font-semibold">\n          Xóa Bảng\n        </button>';

if (html.includes(oldBtn)) {
    html = html.replace(oldBtn, newBtn);
    console.log("Replaced button class");
} else {
    console.log("Could not find button class");
}

const oldClear = /function clearCanvas\(\) \{[\s\S]*?canvas\.requestRenderAll\(\);\s*\}\s*\}/;
const newClear = `function clearCanvas() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ bảng vẽ?")) {
        canvas.clear();
        canvas.backgroundColor = '#FFFFFF';
        canvas.requestRenderAll();
      }
    }`;

if (html.match(oldClear)) {
    html = html.replace(oldClear, newClear);
    console.log("Replaced clearCanvas");
} else {
    console.log("Could not find clearCanvas");
}

fs.writeFileSync('index.html', html);
