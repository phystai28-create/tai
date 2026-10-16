const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /function confirmEditDigital\(\) \{[\s\S]*?closeEditDigital\(\);\s*\}/;
const newConfirm = `    function confirmEditDigital() {
      if (currentDigitalTarget) {
        const val = document.getElementById('editDigitalInput').value;
        if (val.trim() !== "") {
          const textObj = currentDigitalTarget.getObjects().find(o => o.isDisplayValue) || currentDigitalTarget.getObjects().find(o => o.type === 'text' || o.type === 'i-text');
          if (textObj) {
            textObj.set('text', val.trim());
            currentDigitalTarget.addWithUpdate();
            canvas.requestRenderAll();
          }
        }
      }
      closeEditDigital();
    }`;

html = html.replace(regex, newConfirm);
fs.writeFileSync('index.html', html);
console.log("Fixed confirmEditDigital");
