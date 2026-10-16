const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regexT = /function addTetrahedron\(\) \{[\s\S]*?canvas\.setActiveObject\(group\);\s*\}/;
const newT = `    function addTetrahedron() {
        const T = {x: 60, y: -80};
        const L = {x: 0, y: 0};
        const R = {x: 120, y: 0};
        const F = {x: 60, y: 40};
        
        const opts = {stroke: '#333333', strokeWidth: 2, strokeUniform: true, strokeLineCap: 'round', strokeLineJoin: 'round'};
        const dashOpts = {...opts, strokeDashArray: [5,5]};

        const TL = new fabric.Line([T.x, T.y, L.x, L.y], opts);
        const TR = new fabric.Line([T.x, T.y, R.x, R.y], opts);
        const TF = new fabric.Line([T.x, T.y, F.x, F.y], opts);
        const LF = new fabric.Line([L.x, L.y, F.x, F.y], opts);
        const RF = new fabric.Line([R.x, R.y, F.x, F.y], opts);
        const LR = new fabric.Line([L.x, L.y, R.x, R.y], dashOpts);
        
        const boundary = new fabric.Polygon([T, L, F, R], {fill: 'transparent', strokeWidth: 0});

        const group = new fabric.Group([LR, boundary, TL, TR, TF, LF, RF], {
            left: 400, top: 300, originX: 'center', originY: 'center'
        });
        canvas.add(group);
        canvas.setActiveObject(group);
    }`;

const regexP = /function addPyramid\(\) \{[\s\S]*?canvas\.setActiveObject\(group\);\s*\}/;
const newP = `    function addPyramid() {
        const T = {x: 60, y: -90};
        const FL = {x: 0, y: 30};
        const FR = {x: 90, y: 30};
        const BR = {x: 120, y: -15};
        const BL = {x: 30, y: -15};
        
        const opts = {stroke: '#333333', strokeWidth: 2, strokeUniform: true, strokeLineCap: 'round', strokeLineJoin: 'round'};
        const dashOpts = {...opts, strokeDashArray: [5,5]};

        const TFL = new fabric.Line([T.x, T.y, FL.x, FL.y], opts);
        const TFR = new fabric.Line([T.x, T.y, FR.x, FR.y], opts);
        const TBR = new fabric.Line([T.x, T.y, BR.x, BR.y], opts);
        const TBL = new fabric.Line([T.x, T.y, BL.x, BL.y], dashOpts);
        
        const FLFR = new fabric.Line([FL.x, FL.y, FR.x, FR.y], opts);
        const FRBR = new fabric.Line([FR.x, FR.y, BR.x, BR.y], opts);
        const BRBL = new fabric.Line([BR.x, BR.y, BL.x, BL.y], dashOpts);
        const FLBL = new fabric.Line([FL.x, FL.y, BL.x, BL.y], dashOpts);

        const boundary = new fabric.Polygon([T, FL, FR, BR], {fill: 'transparent', strokeWidth: 0});

        const group = new fabric.Group([TBL, FLBL, BRBL, boundary, TFL, TFR, TBR, FLFR, FRBR], {
            left: 400, top: 300, originX: 'center', originY: 'center'
        });
        canvas.add(group);
        canvas.setActiveObject(group);
    }`;

html = html.replace(regexT, newT);
html = html.replace(regexP, newP);
fs.writeFileSync('index.html', html);
console.log("Fixed pyramid/tetrahedron");
