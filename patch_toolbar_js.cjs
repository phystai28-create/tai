const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const oldJS = `    const textToolbar = document.getElementById('textToolbar');
    const btnTextBold = document.getElementById('btnTextBold');
    const btnTextItalic = document.getElementById('btnTextItalic');
    const fontSizeInput = document.getElementById('fontSizeInput');`;

const newJS = `    const floatingToolbar = document.getElementById('floatingToolbar');
    const textControls = document.getElementById('textControls');
    const shapeControls = document.getElementById('shapeControls');
    const btnTextBold = document.getElementById('btnTextBold');
    const btnTextItalic = document.getElementById('btnTextItalic');
    const fontSizeInput = document.getElementById('fontSizeInput');
    const strokeWidthInput = document.getElementById('strokeWidthInput');`;

if (html.includes(oldJS)) {
    html = html.replace(oldJS, newJS);
    console.log("Replaced variables");
} else {
    console.log("Could not find variables");
}

const oldUpdateJS = `    function updateTextToolbar() {
      const obj = canvas.getActiveObject();
      if (!obj || (obj.type !== 'i-text' && obj.type !== 'text')) {
        textToolbar.style.display = 'none';
        return;
      }
      
      textToolbar.style.display = 'flex';
      btnTextBold.style.backgroundColor = obj.fontWeight === 'bold' ? '#e2e8f0' : '';
      btnTextItalic.style.backgroundColor = obj.fontStyle === 'italic' ? '#e2e8f0' : '';
      fontSizeInput.value = obj.fontSize;

      const bound = obj.getBoundingRect();
      textToolbar.style.left = (bound.left + bound.width / 2) + 'px';
      textToolbar.style.top = (bound.top - 10) + 'px';
      textToolbar.style.transform = 'translate(-50%, -100%)';
    }`;

const newUpdateJS = `    window.bringForward = function() {
        const obj = canvas.getActiveObject();
        if (obj) {
            canvas.bringForward(obj);
            canvas.renderAll();
        }
    };
    
    window.sendBackward = function() {
        const obj = canvas.getActiveObject();
        if (obj) {
            canvas.sendBackwards(obj);
            canvas.renderAll();
        }
    };

    window.changeStrokeWidth = function(val) {
        const obj = canvas.getActiveObject();
        if (obj) {
            obj.set('strokeWidth', parseFloat(val));
            canvas.renderAll();
            updateFloatingToolbar();
        }
    };

    function updateFloatingToolbar() {
      const obj = canvas.getActiveObject();
      if (!obj) {
        floatingToolbar.style.display = 'none';
        return;
      }
      
      floatingToolbar.style.display = 'flex';
      
      const isText = (obj.type === 'i-text' || obj.type === 'text');
      
      if (isText) {
          textControls.style.display = 'flex';
          shapeControls.style.display = 'none';
          btnTextBold.style.backgroundColor = obj.fontWeight === 'bold' ? '#e2e8f0' : '';
          btnTextItalic.style.backgroundColor = obj.fontStyle === 'italic' ? '#e2e8f0' : '';
          fontSizeInput.value = obj.fontSize;
      } else {
          textControls.style.display = 'none';
          shapeControls.style.display = 'flex';
          strokeWidthInput.value = obj.strokeWidth || 0;
      }

      const bound = obj.getBoundingRect();
      floatingToolbar.style.left = (bound.left + bound.width / 2) + 'px';
      floatingToolbar.style.top = (bound.top - 10) + 'px';
      floatingToolbar.style.transform = 'translate(-50%, -100%)';
    }`;

if (html.includes(oldUpdateJS)) {
    html = html.replace(oldUpdateJS, newUpdateJS);
    console.log("Replaced updateTextToolbar");
} else {
    console.log("Could not find updateTextToolbar");
}

fs.writeFileSync('index.html', html);
