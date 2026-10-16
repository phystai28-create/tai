const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function clearCanvas\(\) \{[\s\S]*?canvas\.renderAll\(\);\s*\}\s*\}/;
const newClear = `    function clearCanvas() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ bảng vẽ?")) {
        canvas.clear();
        canvas.backgroundColor = '#FFFFFF';
        canvas.renderAll();
      }
    }`;

html = html.replace(regex, newClear);
fs.writeFileSync('index.html', html);
console.log("Fixed clearCanvas again");
