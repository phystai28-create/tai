const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace(
  "const subGroup = new fabric.Group([...objs], {\n              objectCaching: false\n            });",
  "const subGroup = new fabric.Group([...objs], {\n              objectCaching: false,\n              lockMovementX: true,\n              lockMovementY: true,\n              lockRotation: true,\n              lockScalingX: true,\n              lockScalingY: true,\n              hasControls: false\n            });"
);

fs.writeFileSync('index.html', html);
