



    // 1. Khởi tạo Fabric.js Canvas
    const canvas = new fabric.Canvas('physicsCanvas', {
      backgroundColor: '#FFFFFF',
      preserveObjectStacking: true, // Giữ nguyên thứ tự layer khi click chọn
      perPixelTargetFind: true,
      targetFindTolerance: 10
    });

    canvas.on('selection:created', (e) => {
      canvas.perPixelTargetFind = false;
    });
    canvas.on('selection:updated', (e) => {
      canvas.perPixelTargetFind = false;
    });
    canvas.on('selection:cleared', (e) => {
      canvas.perPixelTargetFind = true;
    });


    // Cấu hình điều khiển 2 đầu đoạn thẳng (Line, Arrow, DoubleArrow)
    function makeEdgePositionHandler(pointIndex) {
      return function(dim, finalMatrix, fabricObject) {
        let p = fabricObject.calcLinePoints();
        let x = pointIndex === 0 ? p.x1 : p.x2;
        let y = pointIndex === 0 ? p.y1 : p.y2;
        return fabric.util.transformPoint(
          { x: x, y: y },
          fabric.util.multiplyTransformMatrices(
            fabricObject.canvas.viewportTransform,
            fabricObject.calcTransformMatrix()
          )
        );
      }
    }

    function anchorWrapper(pointIndex) {
      return function(eventData, transform, x, y) {
        var target = transform.target;
        var fixedPointIndex = pointIndex === 0 ? 1 : 0;
        
        var matrix = target.calcTransformMatrix();
        var p = target.calcLinePoints();
        var fixedPointRel = fixedPointIndex === 0 ? {x: p.x1, y: p.y1} : {x: p.x2, y: p.y2};
        var fixedPointAbs = fabric.util.transformPoint(fixedPointRel, matrix);
        
        var p1Abs = pointIndex === 0 ? new fabric.Point(x, y) : fixedPointAbs;
        var p2Abs = pointIndex === 1 ? new fabric.Point(x, y) : fixedPointAbs;

        target.set({
          x1: p1Abs.x, y1: p1Abs.y,
          x2: p2Abs.x, y2: p2Abs.y,
          angle: 0, scaleX: 1, scaleY: 1
        });
        
        target._setWidthHeight();
        
        var newCenter = {
          x: (p1Abs.x + p2Abs.x) / 2,
          y: (p1Abs.y + p2Abs.y) / 2
        };
        target.set({
          left: newCenter.x,
          top: newCenter.y,
          originX: 'center',
          originY: 'center'
        });
        target.setCoords();
        
        return true;
      }
    }

    fabric.Line.prototype.controls = {
      p1: new fabric.Control({
        positionHandler: makeEdgePositionHandler(0),
        actionHandler: anchorWrapper(0),
        cursorStyle: 'pointer',
        actionName: 'modifyLine'
      }),
      p2: new fabric.Control({
        positionHandler: makeEdgePositionHandler(1),
        actionHandler: anchorWrapper(1),
        cursorStyle: 'pointer',
        actionName: 'modifyLine'
      })
    };

    const dimTooltip = document.getElementById('dimTooltip');
    const textToolbar = document.getElementById('textToolbar');
    const btnTextBold = document.getElementById('btnTextBold');
    const btnTextItalic = document.getElementById('btnTextItalic');
    const fontSizeInput = document.getElementById('fontSizeInput');

    function updateDimTooltip(e) {
      const obj = e.target;
      if (!obj) return;
      if (obj.type === 'i-text' || obj.type === 'text') return;
      
      const w = (obj.getScaledWidth()).toFixed(1);
      const h = (obj.getScaledHeight()).toFixed(1);
      
      if (obj.type === 'line' || obj.type === 'arrow' || obj.type === 'double-arrow') {
         const p = obj.calcLinePoints();
         const dx = (p.x2 - p.x1) * obj.scaleX;
         const dy = (p.y2 - p.y1) * obj.scaleY;
         const len = Math.sqrt(dx*dx + dy*dy).toFixed(1);
         let ang = (Math.atan2(dy, dx) * 180 / Math.PI + obj.angle) % 360;
         if (ang < 0) ang += 360;
         ang = ang.toFixed(1);
         dimTooltip.innerHTML = `L: ${len} | Ang: ${ang}° | W: ${w} | H: ${h}`;
      } else {
         dimTooltip.innerHTML = `W: ${w} | H: ${h}`;
      }
      dimTooltip.style.display = 'block';
      
      const bound = obj.getBoundingRect();
      const vpt = canvas.viewportTransform;
      const left = bound.left;
      const top = bound.top;
      dimTooltip.style.left = (left + bound.width / 2) + 'px';
      dimTooltip.style.top = (top - 10) + 'px';
      dimTooltip.style.transform = 'translate(-50%, -100%)';
    }

    function hideDimTooltip() {
      dimTooltip.style.display = 'none';
    }

    canvas.on('object:moving', updateDimTooltip);
    canvas.on('object:scaling', updateDimTooltip);
    canvas.on('object:modifying', updateDimTooltip);
    canvas.on('mouse:up', hideDimTooltip);
    
    function updateTextToolbar() {
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
    }

    canvas.on('selection:created', updateTextToolbar);
    canvas.on('selection:updated', updateTextToolbar);
    canvas.on('selection:cleared', updateTextToolbar);
    canvas.on('object:moving', (e) => { if(e.target && (e.target.type === 'i-text' || e.target.type === 'text')) updateTextToolbar(); });
    canvas.on('object:scaling', (e) => { if(e.target && (e.target.type === 'i-text' || e.target.type === 'text')) updateTextToolbar(); });

    window.toggleTextBold = function() {
      const obj = canvas.getActiveObject();
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
        canvas.renderAll();
        updateTextToolbar();
      }
    };
    window.toggleTextItalic = function() {
      const obj = canvas.getActiveObject();
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
        canvas.renderAll();
        updateTextToolbar();
      }
    };
    window.changeTextFontSize = function(val) {
      const obj = canvas.getActiveObject();
      if (obj && (obj.type === 'i-text' || obj.type === 'text')) {
        obj.set('fontSize', parseInt(val, 10));
        canvas.renderAll();
        updateTextToolbar();
      }
    };
    
    window.setZoom = function(factor) {
      let zoom = canvas.getZoom() * factor;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.1) zoom = 0.1;
      canvas.zoomToPoint({ x: 400, y: 300 }, zoom);
      hideDimTooltip();
      updateTextToolbar();
    };

    // Zoom and Pan
    canvas.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.1) zoom = 0.1;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      hideDimTooltip();
      updateTextToolbar();
    });

    canvas.on('mouse:down', function(opt) {
      var evt = opt.e;
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });
    canvas.on('mouse:move', function(opt) {
      if (this.isDragging) {
        var e = opt.e;
        var vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });
    canvas.on('mouse:up', function(opt) {
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
    });

    // 2. Xử lý xóa vật thể bằng phím Delete / Backspace
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
    });

    // 3. Custom Class cho Vector Lực (Arrow)
    // - Tính năng đặc biệt: Giữ nguyên hình dáng đầu mũi tên khi kéo giãn (scale)
    fabric.Arrow = fabric.util.createClass(fabric.Line, {
      type: 'arrow',
      initialize: function(points, options) {
        options = options || {};
        options.strokeUniform = true; // Không cho phép thay đổi độ dày nét vẽ khi scale
        this.callSuper('initialize', points, options);
        this.label = options.label || '';
      },
      _render: function(ctx) {
        this.callSuper('_render', ctx);
        ctx.save();
        
        const p = this.calcLinePoints();
        const xDiff = this.x2 - this.x1;
        const yDiff = this.y2 - this.y1;
        const angle = Math.atan2(yDiff, xDiff);
        
        // Dịch chuyển đến điểm cuối mũi tên
        ctx.translate(p.x2, p.y2);
        ctx.rotate(angle);
        
        // Khử scale để đầu mũi tên luôn giữ kích thước thật, không bị kéo giãn méo mó
        if (this.scaleX) ctx.scale(1 / this.scaleX, 1);
        if (this.scaleY) ctx.scale(1, 1 / this.scaleY);

        // Vẽ tam giác đầu mũi tên
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-15, 6);
        ctx.lineTo(-15, -6);
        ctx.closePath();
        ctx.fillStyle = this.stroke;
        ctx.fill();

        // Vẽ nhãn ký hiệu (Label)
        if (this.label) {
            ctx.font = 'italic 20px "Times New Roman", Arial';
            // Bù lại góc xoay để chữ luôn thẳng (Tùy chọn, hiện tại đang xoay theo trục mũi tên)
            ctx.fillText(this.label, 10, -10);
        }

        ctx.restore();
      }
    });

    fabric.DoubleArrow = fabric.util.createClass(fabric.Line, {
      type: 'doubleArrow',
      initialize: function(points, options) {
        options = options || {};
        options.strokeUniform = true; 
        this.callSuper('initialize', points, options);
      },
      _render: function(ctx) {
        this.callSuper('_render', ctx);
        
        const p = this.calcLinePoints();
        const xDiff = this.x2 - this.x1;
        const yDiff = this.y2 - this.y1;
        const angle = Math.atan2(yDiff, xDiff);
        
        ctx.save();
        ctx.translate(p.x2, p.y2);
        ctx.rotate(angle);
        if (this.scaleX) ctx.scale(1 / this.scaleX, 1);
        if (this.scaleY) ctx.scale(1, 1 / this.scaleY);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-15, 6); ctx.lineTo(-15, -6);
        ctx.closePath();
        ctx.fillStyle = this.stroke; ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(p.x1, p.y1);
        ctx.rotate(angle + Math.PI);
        if (this.scaleX) ctx.scale(1 / this.scaleX, 1);
        if (this.scaleY) ctx.scale(1, 1 / this.scaleY);
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(-15, 6); ctx.lineTo(-15, -6);
        ctx.closePath();
        ctx.fillStyle = this.stroke; ctx.fill();
        ctx.restore();
      }
    });

    // Angle Tooltip
    const angleTooltip = document.createElement('div');
    angleTooltip.className = "fixed bg-slate-800 text-white text-xs px-2 py-1 rounded pointer-events-none hidden z-50 shadow-lg";
    document.body.appendChild(angleTooltip);

    canvas.on('object:rotating', function(e) {
      const obj = e.target;
      let angle = Math.round(obj.angle % 360);
      if (angle < 0) angle += 360;
      angleTooltip.innerText = angle + '°';
      angleTooltip.style.display = 'block';
      angleTooltip.style.left = (e.e.clientX + 15) + 'px';
      angleTooltip.style.top = (e.e.clientY + 15) + 'px';
    });

    canvas.on('mouse:up', function() {
      angleTooltip.style.display = 'none';
    });

    // 4. Các hàm tạo hình vật lý
        function addCuboid(isCube) {
      const w = isCube ? 60 : 100;
      const h = isCube ? 60 : 50;
      const dx = isCube ? 25 : 30;
      const dy = isCube ? -25 : -20;
      
      const opts = { stroke: '#333333', strokeWidth: 2, strokeUniform: true, strokeLineCap: 'round', strokeLineJoin: 'round' };
      const dashOpts = { ...opts, strokeDashArray: [5, 5] };
      
      const backTop = new fabric.Line([dx, dy, dx + w, dy], opts);
      const backRight = new fabric.Line([dx + w, dy, dx + w, dy + h], opts);
      const backBottom = new fabric.Line([dx, dy + h, dx + w, dy + h], dashOpts);
      const backLeft = new fabric.Line([dx, dy, dx, dy + h], dashOpts);
      
      const connTL = new fabric.Line([0, 0, dx, dy], opts);
      const connTR = new fabric.Line([w, 0, dx + w, dy], opts);
      const connBR = new fabric.Line([w, h, dx + w, dy + h], opts);
      const connBL = new fabric.Line([0, h, dx, dy + h], dashOpts);

      const front = new fabric.Rect({ left: 0, top: 0, width: w, height: h, fill: 'transparent', ...opts, originX: 'left', originY: 'top' });

      const group = new fabric.Group([
        backBottom, backLeft, backTop, backRight, 
        connBL, connTL, connTR, connBR, 
        front
      ], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addSphere() {
      const circle = new fabric.Circle({
        left: 400, top: 300,
        radius: 30,
        originX: 'center', originY: 'center',
        fill: new fabric.Gradient({
          type: 'radial',
          coords: { r1: 0, r2: 30, x1: 10, y1: 10, x2: 30, y2: 30 },
          colorStops: [
            { offset: 0, color: '#ffffff' },
            { offset: 0.8, color: '#94a3b8' },
            { offset: 1, color: '#475569' }
          ]
        }),
        stroke: '#0f172a', strokeWidth: 2,
        strokeUniform: true,
        shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 6, offsetX: 3, offsetY: 3 })
      });
      
      canvas.add(circle);
      canvas.setActiveObject(circle);
    }

    function addRod() {
      const rect = new fabric.Rect({
        left: 400, top: 300,
        width: 150, height: 15,
        originX: 'center', originY: 'center',
        fill: '#94a3b8',
        stroke: '#0f172a', strokeWidth: 2,
        strokeUniform: true
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    }

    function addCylinder() {
      const w = 60, h = 100, ry = 15;
      
      const bottomFill = new fabric.Ellipse({ 
        left: 0, top: h/2, rx: w/2, ry: ry, 
        fill: '#cbd5e1', originX: 'center', originY: 'center', strokeWidth: 0 
      });
      
      const bodyFill = new fabric.Rect({ 
        left: 0, top: 0, width: w, height: h, 
        fill: '#cbd5e1', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const topEllipse = new fabric.Ellipse({ 
        left: 0, top: -h/2, rx: w/2, ry: ry, 
        fill: '#f8fafc', stroke: '#0f172a', strokeWidth: 2, 
        originX: 'center', originY: 'center' 
      });
      
      const sideL = new fabric.Line([0, -h/2, 0, h/2], { 
        left: -w/2, top: 0,
        stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center' 
      });
      
      const sideR = new fabric.Line([0, -h/2, 0, h/2], { 
        left: w/2, top: 0,
        stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center' 
      });
      
      const pathFront = new fabric.Path(`M ${-w/2} 0 A ${w/2} ${ry} 0 0 0 ${w/2} 0`, {
        fill: '', stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center',
        left: 0, top: h/2 + ry/2
      });
      
      const pathBack = new fabric.Path(`M ${-w/2} 0 A ${w/2} ${ry} 0 0 1 ${w/2} 0`, {
        fill: '', stroke: '#0f172a', strokeWidth: 2, strokeDashArray: [5, 5], originX: 'center', originY: 'center',
        left: 0, top: h/2 - ry/2
      });
      
      const group = new fabric.Group([bottomFill, bodyFill, pathBack, pathFront, sideL, sideR, topEllipse], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addHoop() {
      const hoop = new fabric.Circle({
        left: 400, top: 300, radius: 35, fill: '', stroke: '#0f172a', strokeWidth: 8,
        originX: 'center', originY: 'center', lockUniScaling: true
      });
      canvas.add(hoop);
      canvas.setActiveObject(hoop);
    }

    function addHemisphere() {
      const w = 100, h = 50, ry = 15;
      
      const bottomFill = new fabric.Ellipse({ 
        left: 0, top: 0, rx: w/2, ry: ry, 
        fill: '#cbd5e1', strokeWidth: 0, originX: 'center', originY: 'center' 
      });
      
      const domeFill = new fabric.Path(`M ${-w/2} 0 A ${w/2} ${h} 0 0 1 ${w/2} 0`, {
        left: 0, top: -h/2, fill: '#cbd5e1', strokeWidth: 0, originX: 'center', originY: 'center'
      });

      const domeStroke = new fabric.Path(`M ${-w/2} 0 A ${w/2} ${h} 0 0 1 ${w/2} 0`, {
        left: 0, top: -h/2, fill: '', stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center', strokeUniform: true
      });

      const frontArc = new fabric.Path(`M ${-w/2} 0 A ${w/2} ${ry} 0 0 0 ${w/2} 0`, {
        left: 0, top: ry/2, fill: '', stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center', strokeUniform: true
      });

      const backArc = new fabric.Path(`M ${-w/2} 0 A ${w/2} ${ry} 0 0 1 ${w/2} 0`, {
        left: 0, top: -ry/2, fill: '', stroke: '#0f172a', strokeWidth: 2, strokeDashArray: [5,5], originX: 'center', originY: 'center', strokeUniform: true
      });

      const group = new fabric.Group([bottomFill, domeFill, backArc, frontArc, domeStroke], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addPolygon(sides) {
      const radius = 40;
      const points = [];
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 / sides) * i - Math.PI / 2;
        points.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
      }
      const poly = new fabric.Polygon(points, {
        left: 400, top: 300, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2,
        originX: 'center', originY: 'center', strokeUniform: true
      });
      canvas.add(poly);
      canvas.setActiveObject(poly);
    }

    function addRect(isSquare) {
      const rect = new fabric.Rect({
        left: 400, top: 300, width: isSquare ? 60 : 100, height: 60,
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, strokeUniform: true, originX: 'center', originY: 'center'
      });
      canvas.add(rect); canvas.setActiveObject(rect);
    }
    
    function addCircle2D() {
      const circle = new fabric.Circle({
        left: 400, top: 300, radius: 35, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, strokeUniform: true, originX: 'center', originY: 'center'
      });
      canvas.add(circle); canvas.setActiveObject(circle);
    }

    function addTriangle() {
      const tri = new fabric.Triangle({
        left: 400, top: 300, width: 60, height: 60, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, strokeUniform: true, originX: 'center', originY: 'center'
      });
      canvas.add(tri); canvas.setActiveObject(tri);
    }

    function addQuad() {
      const quad = new fabric.Polygon([
        {x: -20, y: -30}, {x: 40, y: -30}, {x: 60, y: 30}, {x: -40, y: 30}
      ], {
        left: 400, top: 300, fill: 'transparent', stroke: '#0f172a', strokeWidth: 2, strokeUniform: true, originX: 'center', originY: 'center'
      });
      canvas.add(quad); canvas.setActiveObject(quad);
    }

    function addLineType(type) {
        if (type === 'solid' || type === 'dashed') {
            const line = new fabric.Line([-50, 0, 50, 0], {
                left: 400, top: 300, stroke: '#0f172a', strokeWidth: 2, strokeUniform: true, originX: 'center', originY: 'center',
                strokeDashArray: type === 'dashed' ? [5, 5] : null
            });
            canvas.add(line); canvas.setActiveObject(line);
        } else if (type === 'arrow1') {
            const arrow = new fabric.Arrow([-50, 0, 50, 0], {
                left: 400, top: 300, stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center'
            });
            canvas.add(arrow); canvas.setActiveObject(arrow);
        } else if (type === 'arrow2') {
            const arrow = new fabric.DoubleArrow([-50, 0, 50, 0], {
                left: 400, top: 300, stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'center'
            });
            canvas.add(arrow); canvas.setActiveObject(arrow);
        }
    }

            function addTetrahedron() {
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
    }

            function addPyramid() {
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
    }

    function addPendulum() {
      const line = new fabric.Line([0, 0, 0, 150], {
        stroke: '#0f172a', strokeWidth: 2, originX: 'center', originY: 'top'
      });
      const bob = new fabric.Circle({
        radius: 12, fill: '#94a3b8', stroke: '#0f172a', strokeWidth: 2,
        left: 0, top: 150, originX: 'center', originY: 'center'
      });
      const group = new fabric.Group([line, bob], {
        left: 400, top: 200, originX: 'center', originY: 'top'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addLabStand() {
      const base = new fabric.Rect({
        width: 140, height: 24, fill: '#64748b', rx: 3, ry: 3,
        left: -70, top: 130, stroke: '#0f172a', strokeWidth: 3
      });
      const rod = new fabric.Rect({
        width: 12, height: 300, fill: '#94a3b8',
        left: -6, top: -170, stroke: '#0f172a', strokeWidth: 3
      });
      const hRod = new fabric.Rect({
        width: 160, height: 10, fill: '#94a3b8',
        left: -20, top: -140, stroke: '#0f172a', strokeWidth: 3
      });
      const clamp1 = new fabric.Rect({
        width: 24, height: 24, fill: '#475569', rx: 3, ry: 3,
        left: -12, top: -147, stroke: '#0f172a', strokeWidth: 3
      });
      const clamp2 = new fabric.Circle({
        radius: 6, fill: '#1e293b',
        left: -6, top: -141, stroke: '#0f172a', strokeWidth: 3
      });
      const group = new fabric.Group([base, rod, hRod, clamp1, clamp2], {
        left: 300, top: 200, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

        function addSpringScale() {
      const body = new fabric.Rect({
        left: -25, top: -90, width: 50, height: 180,
        fill: '#f1f5f9', stroke: '#1e3a8a', strokeWidth: 3, rx: 2, ry: 2
      });
      
      const topHook = new fabric.Path('M 0 -90 L 0 -100 C 0 -110 -10 -100 -10 -110 A 10 10 0 0 1 10 -110', {
        fill: 'transparent', stroke: '#475569', strokeWidth: 3, strokeLineCap: 'round'
      });
      
      let springPath = 'M 0 -90 L 0 -85';
      for(let i=0; i<12; i++) {
        springPath += ` L ${i%2===0 ? 10 : -10} ${-80 + i*5}`;
      }
      springPath += ' L 0 -25 L 0 -16';
      const spring = new fabric.Path(springPath, {
        fill: 'transparent', stroke: '#3b82f6', strokeWidth: 2.5, strokeLineJoin: 'round'
      });
      
      const innerRod = new fabric.Path('M 0 -16 L 0 110', {
        stroke: '#475569', strokeWidth: 3, fill: 'transparent'
      });
      
      const bottomHook = new fabric.Path('M 0 110 L 0 120 C 0 130 -10 120 -10 130 A 10 10 0 0 0 10 130', {
        fill: 'transparent', stroke: '#475569', strokeWidth: 3, strokeLineCap: 'round'
      });
      
      const marker = new fabric.Path('M -15 -16 L 15 -16', {
        stroke: '#ef4444', strokeWidth: 4, fill: 'transparent'
      });
      
      const tickElems = [];
      for(let i=0; i<=5; i++) {
        let ty = -16 + i * 18;
        tickElems.push(new fabric.Line([5, ty, 15, ty], { stroke: '#1e3a8a', strokeWidth: 2 }));
        if(i < 5) {
          tickElems.push(new fabric.Line([8, ty + 9, 15, ty + 9], { stroke: '#1e3a8a', strokeWidth: 1.5 }));
        }
        tickElems.push(new fabric.Text(i.toString(), {
          left: 20, top: ty, fontSize: 12, fill: '#0f172a', fontWeight: 'bold', originY: 'center'
        }));
      }
      
      const nText = new fabric.Text('N', {
        left: -20, top: 74, fontSize: 16, fill: '#0f172a', fontWeight: 'bold'
      });
      
      const group = new fabric.Group([body, topHook, spring, innerRod, bottomHook, marker, nText, ...tickElems], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addWeight() {
      const w = 40, h = 50, rx = 20, ry = 6;
      
      const cylPath = `M -${rx} -${h/2} L -${rx} ${h/2} A ${rx} ${ry} 0 0 0 ${rx} ${h/2} L ${rx} -${h/2} A ${rx} ${ry} 0 0 1 -${rx} -${h/2} Z`;
      const body = new fabric.Path(cylPath, {
        fill: '#64748b', stroke: '#0f172a', strokeWidth: 3
      });
      
      const topOval = new fabric.Ellipse({
        rx: rx, ry: ry, fill: '#94a3b8', stroke: '#0f172a', strokeWidth: 3,
        left: -rx, top: -h/2 - ry
      });
      
      const hook = new fabric.Path(`M 0 -${h/2+ry} L 0 -${h/2+ry+10} A 8 8 0 1 1 12 -${h/2+ry+8}`, {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3
      });
      
      const group = new fabric.Group([body, topOval, hook], {
        left: 450, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addOverflowCan() {
      // Body has exactly one gap on the right: between y=-40 and y=-30
      const bodyPath = new fabric.Path('M -30 -50 L -30 50 A 5 5 0 0 0 -25 55 L 25 55 A 5 5 0 0 0 30 50 L 30 -30 M 30 -40 L 30 -50', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3, strokeLineJoin: 'round', strokeLineCap: 'round'
      });
      // Spout attaches perfectly at the gap
      const spout = new fabric.Path('M 30 -40 L 55 -25 M 55 -20 L 30 -30', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3, strokeLineJoin: 'round', strokeLineCap: 'round'
      });
      // Liquid level exactly at the bottom lip of the spout (y=-30)
      const liquid = new fabric.Path('M -27.5 -30 L -27.5 50 A 2.5 2.5 0 0 0 -25 52.5 L 25 52.5 A 2.5 2.5 0 0 0 27.5 50 L 27.5 -30 Z', {
        fill: '#bae6fd', opacity: 0.7
      });
      const waterLevel = new fabric.Line([-27.5, -30, 27.5, -30], {
        stroke: '#0ea5e9', strokeWidth: 2
      });
      const marks = [];
      for(let i=0; i<9; i++) {
        let y = 40 - i*10;
        marks.push(new fabric.Line([-30, y, -22, y], {stroke: '#0f172a', strokeWidth: 2}));
      }
      const group = new fabric.Group([liquid, waterLevel, bodyPath, spout, ...marks], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }
    function addGraduatedCylinder() {
      const bodyPath = new fabric.Path('M -15 -80 L -15 80 A 5 5 0 0 0 -10 85 L 10 85 A 5 5 0 0 0 15 80 L 15 -80', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3
      });
      const base = new fabric.Line([-25, 85, 25, 85], { stroke: '#0f172a', strokeWidth: 4, strokeLineCap: 'round' });
      const marks = [];
      for(let i=0; i<=15; i++) {
        let y = 70 - i*9;
        let isMajor = i % 5 === 0;
        marks.push(new fabric.Line([-15, y, isMajor ? -5 : -10, y], {stroke: '#0f172a', strokeWidth: isMajor ? 2 : 1.5}));
      }
      const group = new fabric.Group([bodyPath, base, ...marks], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addUTube() {
      const outer = new fabric.Path('M -30 -60 L -30 40 A 30 30 0 0 0 30 40 L 30 -60', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3
      });
      const inner = new fabric.Path('M -10 -60 L -10 40 A 10 10 0 0 0 10 40 L 10 -60', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3
      });
      
      const group = new fabric.Group([outer, inner], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }
    function addPhotogate() {
      const gate = new fabric.Path('M -40 40 L -40 -30 A 10 10 0 0 1 -30 -40 L 30 -40 A 10 10 0 0 1 40 -30 L 40 40 L 20 40 L 20 -20 L -20 -20 L -20 40 Z', {
        fill: '#334155', stroke: '#0f172a', strokeWidth: 2.5, strokeLineJoin: 'round'
      });
      const beam = new fabric.Line([-20, 20, 20, 20], {
        stroke: '#ef4444', strokeWidth: 2.5, strokeDashArray: [5, 3]
      });
      const group = new fabric.Group([gate, beam], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addDigitalTimer() {
      const box = new fabric.Rect({
        width: 240, height: 80, fill: '#eaddc5', stroke: '#d1c4a9', strokeWidth: 2, rx: 5, ry: 5,
        left: -120, top: -40
      });
      const innerBox = new fabric.Rect({
        width: 232, height: 72, fill: '#f5efde', stroke: '#1e293b', strokeWidth: 1.5,
        left: -116, top: -36
      });
      
      const displayFrame = new fabric.Rect({
        width: 76, height: 30, fill: '#111827', stroke: '#eaddc5', strokeWidth: 2, rx: 2, ry: 2,
        left: -100, top: -15
      });
      const displayText = new fabric.Text('0.000', {
        fontSize: 22, fill: '#ef4444', fontFamily: '"Share Tech Mono", monospace', fontWeight: 'bold',
        left: -62, top: 0, originX: 'center', originY: 'center'
      });
      displayText.isDisplayValue = true;
      
      const timeLabel = new fabric.Text('THỜI GIAN (s)', {
        fontSize: 9, fill: '#0f172a', fontFamily: 'sans-serif', fontWeight: 'bold',
        left: -62, top: 23, originX: 'center', originY: 'center'
      });

      const knobOuter = new fabric.Circle({
        radius: 12, fill: '#e2e8f0', stroke: '#94a3b8', strokeWidth: 2,
        left: 20, top: -5, originX: 'center', originY: 'center'
      });
      const knobInner = new fabric.Circle({
        radius: 8, fill: '#f8fafc',
        left: 20, top: -5, originX: 'center', originY: 'center'
      });
      const knobPointer = new fabric.Line([20, -5, 14, -11], {
        stroke: '#475569', strokeWidth: 2, strokeLineCap: 'round'
      });
      const modeLabel = new fabric.Text('MODE', {
        fontSize: 9, fill: '#0f172a', fontFamily: 'sans-serif', fontWeight: 'bold',
        left: 20, top: 23, originX: 'center', originY: 'center'
      });
      
      const ticks = [];
      const modes = ['A', 'B', 'A+B', 'A-B', 'T'];
      for (let i = 0; i < 5; i++) {
        let angle = -Math.PI + (Math.PI / 4.5) * (i + 0.5);
        let x1 = 20 + Math.cos(angle) * 16;
        let y1 = -5 + Math.sin(angle) * 16;
        let x2 = 20 + Math.cos(angle) * 20;
        let y2 = -5 + Math.sin(angle) * 20;
        ticks.push(new fabric.Line([x1, y1, x2, y2], { stroke: '#0f172a', strokeWidth: 1.5 }));
        ticks.push(new fabric.Text(modes[i], {
          fontSize: 8, fill: '#0f172a', fontFamily: 'sans-serif', fontWeight: 'bold',
          left: 20 + Math.cos(angle) * 26, top: -5 + Math.sin(angle) * 26,
          originX: 'center', originY: 'center'
        }));
      }

      const resetBtnOuter = new fabric.Circle({
        radius: 8, fill: '#94a3b8', stroke: '#64748b', strokeWidth: 1,
        left: 85, top: -15, originX: 'center', originY: 'center'
      });
      const resetBtnInner = new fabric.Circle({
        radius: 6, fill: '#ef4444',
        left: 85, top: -15, originX: 'center', originY: 'center'
      });
      const resetLabel = new fabric.Text('RESET', {
        fontSize: 9, fill: '#0f172a', fontFamily: 'sans-serif', fontWeight: 'bold',
        left: 85, top: 2, originX: 'center', originY: 'center'
      });

      const group = new fabric.Group([box, innerBox, displayFrame, displayText, timeLabel, knobOuter, knobInner, knobPointer, modeLabel, ...ticks, resetBtnOuter, resetBtnInner, resetLabel], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      group.isDigitalDisplay = true;
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addPanBalance() {
      const rim = new fabric.Rect({
        left: -125, top: 80, width: 250, height: 10, rx: 3, ry: 3,
        fill: '#475569', stroke: '#1e293b', strokeWidth: 2
      });
      const baseBody = new fabric.Path('M -120 80 L -105 45 L -40 45 L -20 20 L 20 20 L 40 45 L 105 45 L 120 80 Z', {
        fill: '#64748b', stroke: '#1e293b', strokeWidth: 2, strokeLineJoin: 'round'
      });
      const pillar = new fabric.Path('M -15 20 L -8 -90 L 8 -90 L 15 20 Z', {
        fill: '#334155', stroke: '#0f172a', strokeWidth: 2, strokeLineJoin: 'round'
      });
      
      const scaleBg = new fabric.Path('M -25 -120 L 25 -120 L 15 -90 L -15 -90 Z', {
        fill: '#0f172a'
      });
      const scaleWin = new fabric.Rect({
        left: -16, top: -115, width: 32, height: 12, fill: '#ffffff'
      });
      const ticks = [];
      for (let i = -3; i <= 3; i++) {
        ticks.push(new fabric.Line([i*4, -115, i*4, i===0 ? -105 : -109], { stroke: i===0 ? '#ef4444' : '#0f172a', strokeWidth: 1 }));
      }
      
      const pointer = new fabric.Path('M -2 10 L 2 10 L 0 -115 Z', {
        fill: '#ef4444'
      });
      
      const lPost = new fabric.Rect({ left: -94, top: -45, width: 8, height: 90, fill: '#94a3b8', stroke: '#1e293b', strokeWidth: 2 });
      const rPost = new fabric.Rect({ left: 86, top: -45, width: 8, height: 90, fill: '#94a3b8', stroke: '#1e293b', strokeWidth: 2 });
      
      const beam = new fabric.Path('M -105 -8 L 105 -8 A 8 8 0 0 1 105 8 Q 50 25 20 8 L -20 8 Q -50 25 -105 8 A 8 8 0 0 1 -105 -8', {
        fill: '#94a3b8', stroke: '#475569', strokeWidth: 2
      });
      
      const calibBar = new fabric.Line([105, 0, 125, 0], { stroke: '#94a3b8', strokeWidth: 3 });
      const calibWeight = new fabric.Rect({ left: 112, top: -4, width: 8, height: 8, fill: '#f8fafc', stroke: '#475569', strokeWidth: 1.5 });
      
      const cBracket = new fabric.Rect({ left: -10, top: -15, width: 20, height: 30, rx: 3, ry: 3, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const cScrew = new fabric.Circle({ left: -3, top: -3, radius: 3, fill: '#f8fafc', stroke: '#475569', strokeWidth: 1 });

      const lBracket = new fabric.Rect({ left: -100, top: -15, width: 20, height: 30, rx: 3, ry: 3, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const lScrew = new fabric.Circle({ left: -93, top: -3, radius: 3, fill: '#f8fafc', stroke: '#475569', strokeWidth: 1 });

      const rBracket = new fabric.Rect({ left: 80, top: -15, width: 20, height: 30, rx: 3, ry: 3, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const rScrew = new fabric.Circle({ left: 87, top: -3, radius: 3, fill: '#f8fafc', stroke: '#475569', strokeWidth: 1 });
      
      const lPanSupport = new fabric.Rect({ left: -110, top: -45, width: 40, height: 5, rx: 2, ry: 2, fill: '#334155' });
      const lPanBottom = new fabric.Path('M -140 -45 C -140 -20 -40 -20 -40 -45 Z', {
        fill: '#94a3b8', stroke: '#475569', strokeWidth: 2, strokeLineJoin: 'round'
      });
      const lPanTop = new fabric.Ellipse({
        left: -140, top: -53, rx: 50, ry: 8, fill: '#cbd5e1', stroke: '#64748b', strokeWidth: 2
      });
      
      const rPanSupport = new fabric.Rect({ left: 70, top: -45, width: 40, height: 5, rx: 2, ry: 2, fill: '#334155' });
      const rPanBottom = new fabric.Path('M 40 -45 C 40 -20 140 -20 140 -45 Z', {
        fill: '#94a3b8', stroke: '#475569', strokeWidth: 2, strokeLineJoin: 'round'
      });
      const rPanTop = new fabric.Ellipse({
        left: 40, top: -53, rx: 50, ry: 8, fill: '#cbd5e1', stroke: '#64748b', strokeWidth: 2
      });
      
      const group = new fabric.Group([
        pillar, scaleBg, scaleWin, ...ticks, pointer, rim, baseBody, lPost, rPost,
        beam, calibBar, calibWeight, cBracket, cScrew, lBracket, lScrew, rBracket, rScrew,
        lPanSupport, lPanBottom, lPanTop, rPanSupport, rPanBottom, rPanTop
      ], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      canvas.add(group);
      canvas.setActiveObject(group);
    }
    function addDigitalBalance() {
      const base = new fabric.Rect({
        width: 120, height: 25, fill: '#ffffff', stroke: '#0f172a', strokeWidth: 2.5, rx: 3, ry: 3,
        left: -60, top: 0
      });
      const panSupport = new fabric.Rect({
        width: 40, height: 10, fill: '#e2e8f0', stroke: '#0f172a', strokeWidth: 2.5,
        left: -20, top: -10
      });
      const pan = new fabric.Rect({
        width: 100, height: 6, fill: '#ffffff', stroke: '#0f172a', strokeWidth: 2.5, rx: 2, ry: 2,
        left: -50, top: -16
      });
      const displayBox = new fabric.Rect({
        width: 60, height: 18, fill: '#cbd5e1', stroke: '#0f172a', strokeWidth: 2,
        left: -30, top: 3
      });
      const text = new fabric.Text('0.00', {
        fontSize: 16, fill: '#0f172a', fontFamily: '"Share Tech Mono", monospace', fontWeight: 'bold',
        left: 0, top: 12, originX: 'center', originY: 'center'
      });
      text.isDisplayValue = true;
      
      const group = new fabric.Group([base, panSupport, pan, displayBox, text], {
        left: 400, top: 300, originX: 'center', originY: 'center'
      });
      group.isDigitalDisplay = true;
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    let currentDigitalTarget = null;
        function editDigitalValue() {
      let targetObj = canvas.getActiveObject();
      
      // Auto-select if there's only one group on canvas that has a text object
      if (!targetObj || targetObj.type !== 'group') {
        const groupsWithText = canvas.getObjects().filter(o => o.type === 'group' && o.getObjects().some(child => child.type === 'text' || child.type === 'i-text'));
        if (groupsWithText.length === 1) {
          targetObj = groupsWithText[0];
          canvas.setActiveObject(targetObj);
          canvas.renderAll();
        } else if (groupsWithText.length > 1) {
          showToast("Có nhiều thiết bị. Vui lòng click chọn thiết bị bạn muốn sửa trên bản vẽ.");
          return;
        }
      }

      if (targetObj && targetObj.type === 'group') {
        // Find text object to edit (prefer isDisplayValue, otherwise just the first text object)
        const textObj = targetObj.getObjects().find(o => o.isDisplayValue) || targetObj.getObjects().find(o => o.type === 'text' || o.type === 'i-text');
        
        if (textObj) {
          currentDigitalTarget = targetObj;
          const currentVal = textObj.text || "";
          document.getElementById('editDigitalInput').value = currentVal;
          
          const modal = document.getElementById('editDigitalModal');
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
          return;
        }
      }
      
      showToast("Vui lòng chọn Đồng hồ hoặc Cân điện tử trên bản vẽ để sửa số.");
    }
    
    function closeEditDigital() {
      const modal = document.getElementById('editDigitalModal');
      modal.classList.add('hidden');
      modal.style.display = 'none';
      currentDigitalTarget = null;
    }
    
        function confirmEditDigital() {
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
    }

    
            function switchTab(tabId) {
      document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
      document.querySelectorAll('.tab-btn').forEach(el => {
        el.classList.remove('bg-slate-700', 'text-white');
        el.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
      });
      document.getElementById('tab-' + tabId).classList.remove('hidden');
      const activeBtn = document.querySelector(`[onclick="switchTab('${tabId}')"]`);
      if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
        activeBtn.classList.add('bg-slate-700', 'text-white');
      }
    }

    function setZoom(factor) {
      let zoom = canvas.getZoom() * factor;
      if (zoom > 5) zoom = 5;
      if (zoom < 0.2) zoom = 0.2;
      canvas.setZoom(zoom);
    }

            function clearCanvas() {
      if (confirm("Bạn có chắc muốn xóa toàn bộ bảng vẽ?")) {
        canvas.clear();
        canvas.backgroundColor = '#FFFFFF';
        canvas.requestRenderAll();
      }
    }

    function toggleTextBold() {
      let obj = canvas.getActiveObject();
      if (obj && (obj.type === 'text' || obj.type === 'i-text')) {
        obj.set('fontWeight', obj.fontWeight === 'bold' ? 'normal' : 'bold');
        canvas.renderAll();
      }
    }

    function toggleTextItalic() {
      let obj = canvas.getActiveObject();
      if (obj && (obj.type === 'text' || obj.type === 'i-text')) {
        obj.set('fontStyle', obj.fontStyle === 'italic' ? 'normal' : 'italic');
        canvas.renderAll();
      }
    }

    function addText() {
      const text = new fabric.IText('Nhập văn bản', {
        left: 400, top: 300, fontFamily: 'sans-serif', fill: '#0f172a', fontSize: 24, originX: 'center', originY: 'center'
      });
      canvas.add(text);
      canvas.setActiveObject(text);
    }
    
    function addCart() {
      const body = new fabric.Rect({ width: 80, height: 40, fill: '#3b82f6', stroke: '#1e3a8a', strokeWidth: 2, rx: 5, ry: 5, left: -40, top: -30 });
      const wheel1 = new fabric.Circle({ radius: 10, fill: '#334155', left: -30, top: 0 });
      const wheel2 = new fabric.Circle({ radius: 10, fill: '#334155', left: 10, top: 0 });
      const hook = new fabric.Path('M 40 -10 L 50 -10 A 5 5 0 1 1 50 0', { fill: 'transparent', stroke: '#475569', strokeWidth: 3, strokeLineCap: 'round' });
      const group = new fabric.Group([body, wheel1, wheel2, hook], { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addContainer() {
      const beaker = new fabric.Path('M -30 -40 L -30 40 A 10 10 0 0 0 -20 50 L 20 50 A 10 10 0 0 0 30 40 L 30 -40', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3
      });
      const liquid = new fabric.Path('M -27 -10 L -27 40 A 7 7 0 0 0 -20 47 L 20 47 A 7 7 0 0 0 27 40 L 27 -10 Z', {
        fill: '#60a5fa', opacity: 0.6
      });
      const group = new fabric.Group([liquid, beaker], { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

    function addCurve() {
      const curve = new fabric.Path('M -50 0 Q 0 -50 50 0', {
        fill: 'transparent', stroke: '#0f172a', strokeWidth: 3, strokeLineCap: 'round'
      });
      curve.set({ left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(curve);
      canvas.setActiveObject(curve);
    }
    
    function addGround() {
      const line = new fabric.Line([-100, 0, 100, 0], { stroke: '#0f172a', strokeWidth: 3 });
      const marks = [];
      for(let i = -90; i <= 90; i += 10) {
        marks.push(new fabric.Line([i, 0, i-5, 10], { stroke: '#0f172a', strokeWidth: 2 }));
      }
      const group = new fabric.Group([line, ...marks], { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

        function addInclinedPlane() {
      const plane = new fabric.Polygon([
        {x: 0, y: 0},
        {x: 0, y: 150},
        {x: 150, y: 150}
      ], { 
        fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2, 
        left: 400, top: 300, originX: 'center', originY: 'center',
        strokeLineJoin: 'round',
        strokeUniform: true
      });
      canvas.add(plane);
      canvas.setActiveObject(plane);
    }

    function addPivot() {
      const circle = new fabric.Circle({ radius: 6, fill: '#cbd5e1', stroke: '#0f172a', strokeWidth: 2, left: -6, top: -6 });
      const group = new fabric.Group([circle], { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

        function addPulley() {
      const ceiling = new fabric.Rect({ left: -60, top: -50, width: 120, height: 10, fill: '#cbd5e1', stroke: '#475569', strokeWidth: 2 });
      const mount = new fabric.Rect({ left: -8, top: -40, width: 16, height: 45, fill: '#e2e8f0', stroke: '#475569', strokeWidth: 2 });
      const stringL = new fabric.Line([-30, 0, -30, 120], { stroke: '#000000', strokeWidth: 3 });
      const stringR = new fabric.Line([30, 0, 30, 120], { stroke: '#000000', strokeWidth: 3 });
      const stringArc = new fabric.Path('M -30 0 A 30 30 0 0 1 30 0', { fill: 'transparent', stroke: '#000000', strokeWidth: 3 });
      const wheel = new fabric.Circle({ radius: 30, fill: '#94a3b8', stroke: '#475569', strokeWidth: 3, left: -30, top: -30 });
      const dot = new fabric.Circle({ radius: 4, fill: '#0f172a', left: -4, top: -4 });
      
      const group = new fabric.Group([stringL, stringR, stringArc, wheel, mount, dot, ceiling], { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(group);
      canvas.setActiveObject(group);
    }

        function addSpring() {
      const w = 15;
      const h = 5;
      const dy = 8;
      const startY = -40;
      const numCoils = 12;
      
      const parts = [];
      // Top wire
      parts.push(new fabric.Path('M 0 -60 L 0 -45', { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 3, strokeLineCap: 'round' }));
      // Connect to first coil
      parts.push(new fabric.Path(`M 0 -45 Q 0 -40 ${-w} ${startY}`, { fill: 'transparent', stroke: '#cbd5e1', strokeWidth: 4, strokeLineCap: 'round' }));
      
      // Back halves
      for(let i=0; i<numCoils; i++) {
        const cy = startY + i * dy;
        parts.push(new fabric.Path(`M ${w} ${cy+dy/2} C ${w} ${cy+dy/2-h} ${-w} ${cy+dy-h} ${-w} ${cy+dy}`, { fill: 'transparent', stroke: '#64748b', strokeWidth: 3, strokeLineCap: 'round' }));
      }
      
      // Front halves
      for(let i=0; i<numCoils; i++) {
        const cy = startY + i * dy;
        parts.push(new fabric.Path(`M ${-w} ${cy} C ${-w} ${cy+h} ${w} ${cy+dy/2+h} ${w} ${cy+dy/2}`, { fill: 'transparent', stroke: '#e2e8f0', strokeWidth: 4, strokeLineCap: 'round' }));
        parts.push(new fabric.Path(`M ${-w} ${cy} C ${-w} ${cy+h} ${w} ${cy+dy/2+h} ${w} ${cy+dy/2}`, { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 1.5, strokeLineCap: 'round' })); // shading
      }
      
      const endY = startY + numCoils * dy;
      // Connect to bottom wire
      parts.push(new fabric.Path(`M ${-w} ${endY} Q 0 ${endY+5} 0 ${endY+10}`, { fill: 'transparent', stroke: '#cbd5e1', strokeWidth: 4, strokeLineCap: 'round' }));
      parts.push(new fabric.Path(`M 0 ${endY+10} L 0 ${endY+25}`, { fill: 'transparent', stroke: '#94a3b8', strokeWidth: 3, strokeLineCap: 'round' }));
      
      const spring = new fabric.Group(parts, { left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(spring);
      canvas.setActiveObject(spring);
    }

    function addString() {
      const string = new fabric.Line([0, 0, 0, 100], { stroke: '#0f172a', strokeWidth: 2, left: 400, top: 300, originX: 'center', originY: 'center' });
      canvas.add(string);
      canvas.setActiveObject(string);
    }

    function openGraphDialog() {
      document.getElementById('graphModal').classList.remove('hidden');
    }
    
    function closeGraphDialog() {
      document.getElementById('graphModal').classList.add('hidden');
    }
    
            function addGraphFunction() {
      const container = document.getElementById('graph-functions-list');
      if (!container) return;
      const row = document.createElement('div');
      row.className = 'flex gap-2 items-center mb-2 flex-wrap border p-2 rounded bg-white';
      row.innerHTML = `
        <select class="func-type border border-slate-300 rounded p-1 text-sm outline-none">
          <option value="y">y =</option>
          <option value="x">x =</option>
        </select>
        <input type="text" class="func-input flex-1 border border-slate-300 rounded px-2 py-1 text-sm focus:outline-blue-500 min-w-[120px]" placeholder="e.g. sin(x) hoặc x^2">
        
        <div class="flex items-center gap-1">
            <label class="text-xs text-slate-500">Màu:</label>
            <input type="color" class="func-color w-6 h-6 rounded cursor-pointer border-0 p-0" value="#ef4444">
        </div>
        <div class="flex items-center gap-1">
            <label class="text-xs text-slate-500">Nét:</label>
            <input type="number" class="func-weight border border-slate-300 rounded p-1 text-xs w-12 outline-none" value="2" min="1">
        </div>
        <div class="flex items-center gap-1">
            <label class="text-xs text-slate-500">Kiểu:</label>
            <select class="func-dash border border-slate-300 rounded p-1 text-xs outline-none">
                <option value="solid">Liền</option>
                <option value="dashed">Đứt</option>
            </select>
        </div>
        <button onclick="this.parentElement.remove()" class="text-red-500 hover:text-red-700 ml-auto"><span class="material-symbols-outlined text-[18px]">delete</span></button>
      `;
      container.appendChild(row);
    }
    
                function drawGraph() {
      const rows = document.querySelectorAll('#graph-functions-list > div');
      
      const xMin = parseFloat(document.getElementById('graph-xmin').value);
      const xMax = parseFloat(document.getElementById('graph-xmax').value);
      const xStep = parseFloat(document.getElementById('graph-xstep').value);
      const yMin = parseFloat(document.getElementById('graph-ymin').value);
      const yMax = parseFloat(document.getElementById('graph-ymax').value);
      const yStep = parseFloat(document.getElementById('graph-ystep').value);
      
      if (isNaN(xMin) || isNaN(xMax) || isNaN(xStep) || isNaN(yMin) || isNaN(yMax) || isNaN(yStep)) {
          showToast("Vui lòng nhập số hợp lệ.");
          return;
      }
      if (xMax <= xMin || yMax <= yMin || xStep <= 0 || yStep <= 0) {
          showToast("Max phải lớn hơn Min, và Step phải lớn hơn 0.");
          return;
      }

      const showGrid = document.getElementById('graph-grid').checked;
      const xLabelText = document.getElementById('graph-xlabel').value || 'x';
      const yLabelText = document.getElementById('graph-ylabel').value || 'y';
      
      const width = 400;
      const height = (yMax - yMin) / (xMax - xMin) * width; 
      
      if (isNaN(height) || height <= 0 || !isFinite(height)) {
          showToast("Lỗi tính toán kích thước.");
          return;
      }
      
      const scaleX = width / (xMax - xMin);
      const scaleY = height / (yMax - yMin);
      
      const originX = -xMin * scaleX;
      const originY = yMax * scaleY;
      
      const objs = [];
      const anchor = new fabric.Rect({ left: 0, top: 0, width: width, height: height, fill: 'transparent', stroke: 'transparent' });
      objs.push(anchor);
      
      if (showGrid) {
        for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
          const px = originX + x * scaleX;
          if (isFinite(px)) objs.push(new fabric.Line([px, 0, px, height], { stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
        }
        for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
          const py = originY - y * scaleY;
          if (isFinite(py)) objs.push(new fabric.Line([0, py, width, py], { stroke: '#cbd5e1', strokeWidth: 1.5, strokeDashArray: [4, 4] }));
        }
      }
      
      const axisExt = 40;
      const arrowSize = 12;
      let endX = width;
      let endY = 0;
      
      if (yMin <= 0 && yMax >= 0) {
        endX = width + axisExt;
        const startX = -20;
        objs.push(new fabric.Line([startX, originY, endX - arrowSize, originY], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: endX - arrowSize, y: originY - arrowSize/2},
            {x: endX, y: originY},
            {x: endX - arrowSize, y: originY + arrowSize/2}
        ], { fill: '#1e293b', stroke: '#1e293b', strokeWidth: 1, strokeLineJoin: 'miter' }));
      }
      
      if (xMin <= 0 && xMax >= 0) {
        endY = -axisExt;
        const startY = height + 20;
        objs.push(new fabric.Line([originX, startY, originX, endY + arrowSize], { stroke: '#1e293b', strokeWidth: 2 }));
        objs.push(new fabric.Polygon([
            {x: originX - arrowSize/2, y: endY + arrowSize},
            {x: originX, y: endY},
            {x: originX + arrowSize/2, y: endY + arrowSize}
        ], { fill: '#1e293b', stroke: '#1e293b', strokeWidth: 1, strokeLineJoin: 'miter' }));
      }
      
      const formatNum = (num) => { 
         let s = parseFloat(num.toPrecision(10)).toString(); 
         return s.replace('.', ',');
      };

      for (let x = Math.ceil(xMin/xStep)*xStep; x <= xMax; x += xStep) {
        if (Math.abs(x) < 1e-5) continue;
        const px = originX + x * scaleX;
        const py = (yMin <= 0 && yMax >= 0) ? originY : height;
        if (isFinite(px) && isFinite(py)) {
            objs.push(new fabric.Line([px, py-4, px, py+4], { stroke: '#1e293b', strokeWidth: 2 }));
            objs.push(new fabric.Text(formatNum(x), { left: px, top: py + 12, fontSize: 14, fill: '#334155', fontFamily: 'Times New Roman', originX: 'center' }));
        }
      }
      for (let y = Math.ceil(yMin/yStep)*yStep; y <= yMax; y += yStep) {
        if (Math.abs(y) < 1e-5) continue;
        const py = originY - y * scaleY;
        const px = (xMin <= 0 && xMax >= 0) ? originX : 0;
        if (isFinite(px) && isFinite(py)) {
            objs.push(new fabric.Line([px-4, py, px+4, py], { stroke: '#1e293b', strokeWidth: 2 }));
            objs.push(new fabric.Text(formatNum(y), { left: px - 8, top: py, fontSize: 14, fill: '#334155', fontFamily: 'Times New Roman', originX: 'right', originY: 'center' }));
        }
      }
      
      rows.forEach(row => {
        const type = row.querySelector('.func-type').value;
        const expr = row.querySelector('.func-input').value;
        const color = row.querySelector('.func-color').value;
        const weight = parseInt(row.querySelector('.func-weight').value) || 2;
        const dash = row.querySelector('.func-dash').value;
        
        if (!expr || !window.math) return;
        
        let processedExpr = expr.trim();
        if (type === 'y' && processedExpr.startsWith('y=')) processedExpr = processedExpr.substring(2);
        else if (type === 'y' && processedExpr.startsWith('y =')) processedExpr = processedExpr.substring(3);
        else if (type === 'x' && processedExpr.startsWith('x=')) processedExpr = processedExpr.substring(2);
        else if (type === 'x' && processedExpr.startsWith('x =')) processedExpr = processedExpr.substring(3);
        
        if (processedExpr.startsWith('f(x)=')) processedExpr = processedExpr.substring(5);
        else if (processedExpr.startsWith('f(x) =')) processedExpr = processedExpr.substring(6);
        
        processedExpr = processedExpr.replace(/\*\*/g, '^');
        
        const dashArray = dash === 'dashed' ? [weight * 3, weight * 3] : null;
        
        let pDataStr = "";
        let isDrawing = false;
        let prevPx = null;
        let prevPy = null;
        
        try {
            const compiled = math.compile(processedExpr);
            
            if (type === 'y') {
                for (let px = 0; px <= width; px += 1) {
                  const x = (px - originX) / scaleX;
                  const y = compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(y) && !isNaN(y)) {
                    const py = originY - y * scaleY;
                    
                    if (py >= 0 && py <= height) {
                      if (!isDrawing) {
                         if (prevPx !== null && prevPy !== null) {
                            let intersectY = prevPy < 0 ? 0 : height;
                            let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
                            pDataStr += " M " + intersectX.toFixed(2) + " " + intersectY.toFixed(2) + " L " + px.toFixed(2) + " " + py.toFixed(2);
                         } else {
                            pDataStr += " M " + px.toFixed(2) + " " + py.toFixed(2);
                         }
                         isDrawing = true;
                      } else {
                         pDataStr += " L " + px.toFixed(2) + " " + py.toFixed(2);
                      }
                    } else {
                      if (isDrawing) {
                         let intersectY = py < 0 ? 0 : height;
                         let intersectX = prevPx + (px - prevPx) * (intersectY - prevPy) / (py - prevPy);
                         pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                         isDrawing = false;
                      }
                    }
                    prevPx = px;
                    prevPy = py;
                  } else {
                    isDrawing = false;
                    prevPx = null;
                    prevPy = null;
                  }
                }
            } else {
                for (let py = 0; py <= height; py += 1) {
                  const y = (originY - py) / scaleY;
                  const x = compiled.evaluate({ y: y, e: Math.E, pi: Math.PI });
                  
                  if (isFinite(x) && !isNaN(x)) {
                    const px = originX + x * scaleX;
                    
                    if (px >= 0 && px <= width) {
                      if (!isDrawing) {
                         if (prevPx !== null && prevPy !== null) {
                            let intersectX = prevPx < 0 ? 0 : width;
                            let intersectY = prevPy + (py - prevPy) * (intersectX - prevPx) / (px - prevPx);
                            pDataStr += " M " + intersectX.toFixed(2) + " " + intersectY.toFixed(2) + " L " + px.toFixed(2) + " " + py.toFixed(2);
                         } else {
                            pDataStr += " M " + px.toFixed(2) + " " + py.toFixed(2);
                         }
                         isDrawing = true;
                      } else {
                         pDataStr += " L " + px.toFixed(2) + " " + py.toFixed(2);
                      }
                    } else {
                      if (isDrawing) {
                         let intersectX = px < 0 ? 0 : width;
                         let intersectY = prevPy + (py - prevPy) * (intersectX - prevPx) / (px - prevPx);
                         pDataStr += " L " + intersectX.toFixed(2) + " " + intersectY.toFixed(2);
                         isDrawing = false;
                      }
                    }
                    prevPx = px;
                    prevPy = py;
                  } else {
                    isDrawing = false;
                    prevPx = null;
                    prevPy = null;
                  }
                }
            }
            
            if (pDataStr && pDataStr.includes('L')) {
              objs.push(new fabric.Path(pDataStr.trim(), { fill: 'transparent', stroke: color, strokeWidth: weight, strokeDashArray: dashArray, strokeLineJoin: 'round' }));
            }
        } catch(e) {
            console.error(e);
        }
      });
      
      if (objs.length > 0) {
        try {
            const graphGroup = new fabric.Group([...objs], {
              left: 400, top: 300, originX: 'center', originY: 'center'
            });
            canvas.add(graphGroup);
            
            const absZeroX = graphGroup.left + anchor.left;
            const absZeroY = graphGroup.top + anchor.top;
            
            if (yMin <= 0 && yMax >= 0) {
                const xLbl = new fabric.Text(xLabelText, { 
                    left: absZeroX + endX + 15, 
                    top: absZeroY + originY, 
                    fontSize: 16, 
                    fill: '#1e293b', 
                    fontStyle: 'italic', 
                    fontFamily: 'Times New Roman', 
                    originX: 'left', 
                    originY: 'center' 
                });
                canvas.add(xLbl);
            }
            
            if (xMin <= 0 && xMax >= 0) {
                const yLbl = new fabric.Text(yLabelText, { 
                    left: absZeroX + originX, 
                    top: absZeroY + endY - 15, 
                    fontSize: 16, 
                    fill: '#1e293b', 
                    fontStyle: 'italic', 
                    fontFamily: 'Times New Roman', 
                    originX: 'center', 
                    originY: 'bottom' 
                });
                canvas.add(yLbl);
                
                if (yMin <= 0 && yMax >= 0) { 
                     const oLbl = new fabric.Text('O', { 
                        left: absZeroX + originX - 12, 
                        top: absZeroY + originY + 12, 
                        fontSize: 16, 
                        fill: '#1e293b', 
                        fontStyle: 'italic', 
                        fontFamily: 'Times New Roman', 
                        originX: 'right', 
                        originY: 'top' 
                     });
                     canvas.add(oLbl);
                }
            }
            
            canvas.setActiveObject(graphGroup);
        } catch(err) {
            console.error(err);
            showToast("Lỗi khi tạo nhóm đồ thị.");
        }
      }
      closeGraphDialog();
    }

    function groupObjects() {
      const active = canvas.getActiveObject();
      if (!active || active.type !== 'activeSelection') {
        showToast('Vui lòng quét chọn nhiều đối tượng để nhóm.');
        return;
      }
      active.toGroup();
      canvas.requestRenderAll();
      showToast('Đã nhóm các đối tượng.');
    }

    function ungroupObjects() {
      const active = canvas.getActiveObject();
      if (!active || active.type !== 'group') {
        showToast('Vui lòng chọn một nhóm để tách.');
        return;
      }
      active.toActiveSelection();
      canvas.requestRenderAll();
      showToast('Đã tách nhóm.');
    }

    function copyToClipboard() {
      canvas.discardActiveObject();
      canvas.renderAll();
      
      const dataURL = canvas.toDataURL({
        format: 'png',
        multiplier: 2,
        left: 0,
        top: 0,
        width: canvas.width,
        height: canvas.height
      });
      
      fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
          if (navigator.clipboard && window.ClipboardItem) {
            navigator.clipboard.write([
              new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
              showToast("Đã copy thành công, bạn có thể dán (Ctrl+V) vào Word!");
            }).catch(err => {
              console.error(err);
              fallbackDownload(dataURL);
            });
          } else {
             fallbackDownload(dataURL);
          }
        }).catch(err => {
          showToast("Lỗi tạo ảnh.");
          console.error(err);
        });
    }

    function fallbackDownload(dataURL) {
      showToast("Không thể copy trực tiếp, đang tải ảnh xuống...");
      const link = document.createElement('a');
      link.download = 'physics_drawing.png';
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    function showToast(msg) {
        const t = document.getElementById('toastMsg');
        t.innerText = msg;
        t.parentElement.classList.remove('translate-y-[150%]');
        setTimeout(() => {
            t.parentElement.classList.add('translate-y-[150%]');
        }, 3000);
    }

  
