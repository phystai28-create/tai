const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldKeydown = `    // 2. Xử lý xóa vật thể bằng phím Delete / Backspace
    window.addEventListener('keydown', (e) => {
      // Bỏ qua nếu đang gõ vào input, textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObj = canvas.getActiveObject();
        // Không xóa nếu đang gõ text trên canvas
        if (activeObj && activeObj.isEditing) return;
        
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          activeObjects.forEach(obj => canvas.remove(obj));
          canvas.discardActiveObject();
        }
      }
    });`;
    
const newKeydown = `    // 2. Xử lý xóa vật thể bằng phím Delete / Backspace
    window.addEventListener('keydown', (e) => {
      // Bỏ qua nếu đang gõ vào input, textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObj = canvas.getActiveObject();
        // Không xóa nếu đang gõ text trên canvas
        if (activeObj && activeObj.isEditing) return;
        
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length) {
          canvas.discardActiveObject();
          activeObjects.forEach(obj => canvas.remove(obj));
          canvas.requestRenderAll();
        }
      }
    });`;

if (html.includes(oldKeydown)) {
    html = html.replace(oldKeydown, newKeydown);
    fs.writeFileSync('index.html', html);
    console.log("Fixed keydown delete");
} else {
    console.log("Could not find oldKeydown");
}
