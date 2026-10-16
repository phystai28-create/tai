
const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    await page.setContent(require('fs').readFileSync('index.html', 'utf8'));
    
    // add math js
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.8.0/math.js' });
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js' });
    
    await page.evaluate(() => {
        // Mock the dialog fields
        document.body.innerHTML += `
        <input id="graph-xmin" value="-10">
        <input id="graph-xmax" value="10">
        <input id="graph-xstep" value="2">
        <input id="graph-ymin" value="-10">
        <input id="graph-ymax" value="10">
        <input id="graph-ystep" value="2">
        <input id="graph-grid" type="checkbox" checked>
        <input id="graph-xlabel" value="x">
        <input id="graph-ylabel" value="y">
        <div id="graph-functions-list">
           <div>
               <select class="func-type"><option value="y">y=</option></select>
               <input class="func-input" value="x^2">
               <input class="func-color" value="#000000">
               <input class="func-weight" value="2">
               <select class="func-dash"><option value="solid"></option></select>
           </div>
        </div>
        <div id="graphModal" class="hidden"></div>
        <canvas id="physicsCanvas" width="800" height="600"></canvas>
        `;
        
        // initialize canvas
        window.canvas = new fabric.Canvas('physicsCanvas');
        window.closeGraphDialog = () => {};
    });
    
    // extract and run drawGraph from index.html
    const drawGraphCode = require('fs').readFileSync('index.html', 'utf8').match(/function drawGraph\(\) \{[\s\S]*?closeGraphDialog\(\);\s*\}/)[0];
    
    await page.evaluate(drawGraphCode);
    
    await page.evaluate(() => {
        drawGraph();
    });
    
    await browser.close();
})();
