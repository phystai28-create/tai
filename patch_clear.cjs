const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldClear = `    function clearCanvas() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ bảng vẽ?")) {
        canvas.clear();
        canvas.backgroundColor = '#FFFFFF';
        canvas.requestRenderAll();
      }
    }`;

const newClear = `    function clearCanvas() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ bảng vẽ?")) {
        canvas.clear();
        canvas.backgroundColor = '#FFFFFF';
        canvas.requestRenderAll();
        canvasGridLines = [];
        const gridBtn = document.getElementById('grid-toggle-btn');
        if (gridBtn) {
            gridBtn.classList.remove('bg-blue-600', 'text-white');
            gridBtn.classList.add('bg-blue-500/20', 'text-blue-100');
        }
      }
    }`;

if (html.includes(oldClear)) {
    html = html.replace(oldClear, newClear);
}

fs.writeFileSync('index.html', html);
