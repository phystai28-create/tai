import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { 
  Activity, Circle, ArrowUpRight, LineChart, 
  Copy, Trash2, MousePointer2, Plus, ArrowDown, Target
} from 'lucide-react';
import { CanvasItem } from './types';
import { Pendulum } from './components/Pendulum';
import { SpringMass } from './components/SpringMass';
import { InclinedPlane } from './components/InclinedPlane';
import { Pulley } from './components/Pulley';
import { Vector } from './components/Vector';
import { Graph } from './components/Graph';
import { Surfaces } from './components/Surfaces';
import { RigidBodies } from './components/RigidBodies';
import { Mechanisms } from './components/Mechanisms';
import { PhysicsVectors } from './components/PhysicsVectors';
import { Annotations } from './components/Annotations';

export default function App() {
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('mechanics');
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addGenericItem = (type: CanvasItem['type'], overrides: Partial<CanvasItem>) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    let newItem: any = {
      id: generateId(),
      type,
      x: centerX,
      y: centerY,
      ...overrides
    };

    setItems([...items, newItem]);
    setSelectedId(newItem.id);
  };

  const addItem = (type: CanvasItem['type']) => {
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    let newItem: any = {
      id: generateId(),
      type,
      x: centerX - 50,
      y: centerY - 50,
    };

    switch (type) {
      case 'pendulum':
        newItem = { ...newItem, length: 150, angle: 30, radius: 20 };
        break;
      case 'spring_mass':
        newItem = { ...newItem, length: 100, coils: 8, massWidth: 40, massHeight: 40 };
        break;
      case 'inclined_plane':
        newItem = { ...newItem, width: 200, height: 100, angle: 30, blockWidth: 40, blockHeight: 30, x: centerX - 100, y: centerY + 50 };
        break;
      case 'pulley':
        newItem = { ...newItem, radius: 30, ropeLength1: 150, ropeLength2: 100, massRadius1: 20, massRadius2: 25, y: centerY - 100 };
        break;
      case 'vector':
        newItem = { ...newItem, length: 100, angle: -45 };
        break;
      case 'graph':
        newItem = { ...newItem, expression: 'sin(x)*2', width: 200, height: 150, xMin: 0, xMax: 10, x: centerX - 100, y: centerY - 75 };
        break;
    }

    setItems([...items, newItem as CanvasItem]);
    setSelectedId(newItem.id);
  };

  const handleDragEnd = (id: string, x: number, y: number) => {
    setItems(items.map(item => item.id === id ? { ...item, x, y } : item));
  };

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background';
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  const updateSelectedItem = (updates: any) => {
    setItems(items.map(item => item.id === selectedId ? { ...item, ...updates } : item));
  };

  const copyToClipboard = async () => {
    if (!stageRef.current) return;
    
    // Deselect before capturing so we don't copy selection outlines
    const prevSelected = selectedId;
    setSelectedId(null);
    
    // Wait a tick for React to re-render without selections
    setTimeout(async () => {
      try {
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 3 }); // High resolution
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } catch (err) {
        console.error('Failed to copy image: ', err);
        alert('Không thể copy ảnh. Trình duyệt của bạn có thể không hỗ trợ.');
      } finally {
        setSelectedId(prevSelected); // Restore selection
      }
    }, 50);
  };

  const selectedItem = items.find(i => i.id === selectedId);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100 font-['Helvetica_Neue',Arial,sans-serif] text-slate-800">
      {/* Top Nav */}
      <nav className="h-[60px] shrink-0 bg-slate-800 text-white flex items-center justify-between px-6 shadow-[0_2px_4px_rgba(0,0,0,0.1)] z-20">
        <div className="text-[18px] font-bold tracking-[0.5px] flex items-center gap-2.5">
          <span>⚛</span> PHYS-DRAW PRO v1.0
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setItems([])}
            className="bg-white/10 hover:bg-white/20 text-white border-none p-2.5 rounded-md cursor-pointer text-[13px] text-center transition-all duration-200"
          >
            Xóa Bảng
          </button>
          <button 
            onClick={copyToClipboard}
            className="bg-emerald-500 hover:bg-emerald-600 text-white border-none px-5 py-2.5 rounded-md font-bold cursor-pointer text-[13px] text-center transition-all duration-200"
          >
            COPY TO WORD (HD)
          </button>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[300px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 shrink-0">
            {['mechanics', 'thermodynamics', 'electromagnetism', 'optics'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-1 py-2 text-[10px] uppercase font-bold text-center transition-colors ${
                  activeCategory === cat ? 'bg-slate-100 text-slate-800 border-b-2 border-slate-800' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {cat === 'mechanics' ? 'Cơ' : cat === 'thermodynamics' ? 'Nhiệt' : cat === 'electromagnetism' ? 'Điện' : 'Quang'}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 gap-6 flex flex-col">
            {activeCategory === 'mechanics' ? (
              <>
                <div className="flex flex-col gap-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">Môi trường</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => addGenericItem('surface', { surfaceType: 'horizontal', width: 200, height: 20 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Mặt ngang</button>
                     <button onClick={() => addGenericItem('surface', { surfaceType: 'vertical', width: 20, height: 150 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Tường đứng</button>
                     <button onClick={() => addItem('inclined_plane')} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Mặt nghiêng</button>
                     <button onClick={() => addGenericItem('surface', { surfaceType: 'concave', width: 120, height: 120 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Hố lõm</button>
                     <button onClick={() => addGenericItem('surface', { surfaceType: 'convex', width: 120, height: 120 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Đồi lồi</button>
                     <button onClick={() => addGenericItem('surface', { surfaceType: 'steps', width: 100, height: 80 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Bậc thang</button>
                     <button onClick={() => addGenericItem('surface', { surfaceType: 'coordinate', width: 150, height: 150 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] col-span-2">Hệ trục tọa độ (Oxy)</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">Vật thể</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => addGenericItem('rigid_body', { bodyType: 'block', width: 60, height: 40, radius: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Khối hộp</button>
                     <button onClick={() => addGenericItem('rigid_body', { bodyType: 'sphere', width: 0, height: 0, radius: 20 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Hình cầu</button>
                     <button onClick={() => addGenericItem('rigid_body', { bodyType: 'rod', width: 120, height: 10, radius: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Thanh cứng</button>
                     <button onClick={() => addGenericItem('rigid_body', { bodyType: 'disk', width: 0, height: 0, radius: 30 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Đĩa tròn</button>
                     <button onClick={() => addGenericItem('rigid_body', { bodyType: 'hoop', width: 0, height: 0, radius: 30 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Vành khuyên</button>
                     <button onClick={() => addGenericItem('rigid_body', { bodyType: 'cart', width: 60, height: 30, radius: 8 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Chiếc xe</button>
                     <button onClick={() => addItem('pendulum')} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Con lắc đơn</button>
                     <button onClick={() => addItem('spring_mass')} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Con lắc lò xo</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">Kết nối & Cơ cấu</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => addGenericItem('mechanism', { mechanismType: 'string', length: 150 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Sợi dây</button>
                     <button onClick={() => addGenericItem('mechanism', { mechanismType: 'spring', length: 100, state: 'normal' })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Lò xo</button>
                     <button onClick={() => addItem('pulley')} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Hệ ròng rọc</button>
                     <button onClick={() => addGenericItem('mechanism', { mechanismType: 'pivot', length: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Điểm tựa</button>
                     <button onClick={() => addGenericItem('mechanism', { mechanismType: 'pin', length: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Đinh/Trục</button>
                     <button onClick={() => addGenericItem('mechanism', { mechanismType: 'rail', length: 150 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Ray trượt</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">Vector Lực & Động học</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'force', length: 80, angle: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] font-bold">Lực chung (F)</button>
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'gravity', length: 80, angle: 90 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] font-bold">Trọng lực (P)</button>
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'normal', length: 80, angle: -90 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] font-bold">Phản lực (N)</button>
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'friction', length: 60, angle: 180 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] font-bold">Ma sát (Fms)</button>
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'tension', length: 60, angle: -90 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] font-bold">Căng dây (T)</button>
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'velocity', length: 60, angle: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] text-red-600 font-bold">Vận tốc (v,a)</button>
                     <button onClick={() => addGenericItem('physics_vector', { vectorType: 'angular', length: 30, angle: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] col-span-2 text-red-600 font-bold">Vận tốc góc (ω,γ)</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">Ký hiệu & Ghi chú</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'com', width: 0, height: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Trọng tâm</button>
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'point_mass', width: 0, height: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Chất điểm</button>
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'trajectory', width: 100, height: 50 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Quỹ đạo</button>
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'angle', width: 0, height: 0, radius: 40, text: 'α' })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Góc (α)</button>
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'right_angle', width: 0, height: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Góc vuông</button>
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'dimension', width: 80, height: 0, text: 'L' })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Kích thước</button>
                     <button onClick={() => addGenericItem('annotation', { annotationType: 'line_of_action', width: 100, height: 0 })} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px] col-span-2">Đường tác dụng</button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-[1px]">Khác</div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => addItem('graph')} className="bg-slate-50 border border-slate-200 p-2 rounded-md hover:bg-slate-100 text-[11px]">Vẽ đồ thị</button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 text-[12px] py-10">
                Các chức năng {activeCategory === 'thermodynamics' ? 'Nhiệt học' : activeCategory === 'electromagnetism' ? 'Điện học' : 'Quang học'} đang được phát triển...
              </div>
            )}
          </div>

          <div className="flex-1">
            {selectedItem ? (
              <div className="flex flex-col gap-2.5">
                <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-[1px]">Thông số vật thể</div>
                <div className="space-y-2">
                  {selectedItem.type === 'pendulum' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Chiều dài dây</label>
                        <input type="range" min="50" max="300" value={(selectedItem as any).length} onChange={e => updateSelectedItem({length: Number(e.target.value)})} className="w-full" />
                      </div>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Góc lệch (độ)</label>
                        <input type="range" min="-90" max="90" value={(selectedItem as any).angle} onChange={e => updateSelectedItem({angle: Number(e.target.value)})} className="w-full" />
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'inclined_plane' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Góc nghiêng (độ)</label>
                        <input type="range" min="10" max="80" value={(selectedItem as any).angle} onChange={e => updateSelectedItem({angle: Number(e.target.value)})} className="w-full" />
                      </div>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Chiều dài mặt phẳng</label>
                        <input type="range" min="100" max="400" value={(selectedItem as any).width} onChange={e => updateSelectedItem({width: Number(e.target.value)})} className="w-full" />
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'spring_mass' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Độ giãn (chiều dài lò xo)</label>
                        <input type="range" min="50" max="250" value={(selectedItem as any).length} onChange={e => updateSelectedItem({length: Number(e.target.value)})} className="w-full" />
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'vector' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Độ dài vector</label>
                        <input type="range" min="20" max="300" value={(selectedItem as any).length} onChange={e => updateSelectedItem({length: Number(e.target.value)})} className="w-full" />
                      </div>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Góc xoay (độ)</label>
                        <input type="range" min="-180" max="180" value={(selectedItem as any).angle} onChange={e => updateSelectedItem({angle: Number(e.target.value)})} className="w-full" />
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'graph' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Hàm số y = f(x)</label>
                        <input 
                          type="text" 
                          value={(selectedItem as any).expression} 
                          onChange={e => updateSelectedItem({expression: e.target.value})}
                          className="p-2 border border-slate-200 rounded text-[13px] w-full bg-white outline-none focus:border-slate-400 font-mono"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[12px] text-slate-600 block mb-1">x min</label>
                          <input type="number" value={(selectedItem as any).xMin} onChange={e => updateSelectedItem({xMin: Number(e.target.value)})} className="p-2 border border-slate-200 rounded text-[13px] w-full bg-white outline-none focus:border-slate-400" />
                        </div>
                        <div className="flex-1">
                          <label className="text-[12px] text-slate-600 block mb-1">x max</label>
                          <input type="number" value={(selectedItem as any).xMax} onChange={e => updateSelectedItem({xMax: Number(e.target.value)})} className="p-2 border border-slate-200 rounded text-[13px] w-full bg-white outline-none focus:border-slate-400" />
                        </div>
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'surface' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Kích thước X (rộng)</label>
                        <input type="range" min="50" max="400" value={(selectedItem as any).width || 0} onChange={e => updateSelectedItem({width: Number(e.target.value)})} className="w-full" />
                      </div>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Kích thước Y (cao)</label>
                        <input type="range" min="20" max="400" value={(selectedItem as any).height || 0} onChange={e => updateSelectedItem({height: Number(e.target.value)})} className="w-full" />
                      </div>
                    </>
                  )}
                  {selectedItem.type === 'rigid_body' && (
                    <>
                      {['block', 'rod', 'cart'].includes((selectedItem as any).bodyType) && (
                        <>
                          <div>
                            <label className="text-[12px] text-slate-600 block mb-1">Kích thước ngang (width)</label>
                            <input type="range" min="10" max="200" value={(selectedItem as any).width || 0} onChange={e => updateSelectedItem({width: Number(e.target.value)})} className="w-full" />
                          </div>
                          <div>
                            <label className="text-[12px] text-slate-600 block mb-1">Kích thước dọc (height)</label>
                            <input type="range" min="10" max="200" value={(selectedItem as any).height || 0} onChange={e => updateSelectedItem({height: Number(e.target.value)})} className="w-full" />
                          </div>
                        </>
                      )}
                      {['sphere', 'disk', 'hoop', 'cart'].includes((selectedItem as any).bodyType) && (
                        <div>
                          <label className="text-[12px] text-slate-600 block mb-1">Bán kính</label>
                          <input type="range" min="10" max="100" value={(selectedItem as any).radius || 0} onChange={e => updateSelectedItem({radius: Number(e.target.value)})} className="w-full" />
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'mechanism' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Chiều dài</label>
                        <input type="range" min="20" max="300" value={(selectedItem as any).length || 0} onChange={e => updateSelectedItem({length: Number(e.target.value)})} className="w-full" />
                      </div>
                      {(selectedItem as any).mechanismType === 'spring' && (
                        <div>
                          <label className="text-[12px] text-slate-600 block mb-1">Trạng thái</label>
                          <select 
                            value={(selectedItem as any).state || 'normal'}
                            onChange={e => updateSelectedItem({state: e.target.value})}
                            className="w-full p-2 border border-slate-200 rounded text-[12px] outline-none"
                          >
                            <option value="normal">Bình thường</option>
                            <option value="compressed">Nén</option>
                            <option value="stretched">Giãn</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'physics_vector' && (
                    <>
                      <div>
                        <label className="text-[12px] text-slate-600 block mb-1">Độ lớn (Chiều dài)</label>
                        <input type="range" min="20" max="200" value={(selectedItem as any).length || 0} onChange={e => updateSelectedItem({length: Number(e.target.value)})} className="w-full" />
                      </div>
                      {(selectedItem as any).vectorType !== 'angular' && (
                        <div>
                          <label className="text-[12px] text-slate-600 block mb-1">Góc xoay (độ)</label>
                          <input type="range" min="-180" max="180" value={(selectedItem as any).angle || 0} onChange={e => updateSelectedItem({angle: Number(e.target.value)})} className="w-full" />
                        </div>
                      )}
                    </>
                  )}
                  {selectedItem.type === 'annotation' && (
                    <>
                      {(selectedItem as any).annotationType !== 'point_mass' && (selectedItem as any).annotationType !== 'com' && (
                        <>
                          <div>
                            <label className="text-[12px] text-slate-600 block mb-1">Kích thước ngang (width)</label>
                            <input type="range" min="20" max="200" value={(selectedItem as any).width || 0} onChange={e => updateSelectedItem({width: Number(e.target.value)})} className="w-full" />
                          </div>
                          <div>
                            <label className="text-[12px] text-slate-600 block mb-1">Kích thước dọc (height / radius)</label>
                            <input type="range" min="0" max="100" value={(selectedItem as any).height || (selectedItem as any).radius || 0} onChange={e => {
                               updateSelectedItem({height: Number(e.target.value), radius: Number(e.target.value)})
                            }} className="w-full" />
                          </div>
                        </>
                      )}
                      {(selectedItem as any).text !== undefined && (
                        <div>
                          <label className="text-[12px] text-slate-600 block mb-1">Ký hiệu (Text)</label>
                          <input type="text" value={(selectedItem as any).text || ''} onChange={e => updateSelectedItem({text: e.target.value})} className="w-full p-2 border border-slate-200 rounded text-[12px] outline-none" />
                        </div>
                      )}
                    </>
                  )}
                  <button 
                    onClick={() => {
                      setItems(items.filter(i => i.id !== selectedId));
                      setSelectedId(null);
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded border border-red-100 text-[12px] font-medium transition-colors"
                  >
                    <Trash2 size={14} /> Xóa hình này
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-[1px]">Thông số vật thể</div>
                <div className="text-[12px] text-slate-500">Click chọn vật thể trên canvas để điều chỉnh</div>
              </div>
            )}
          </div>

          <button 
            onClick={copyToClipboard}
            className="bg-blue-600 hover:bg-blue-700 text-white border-none p-3 rounded-md font-semibold cursor-pointer w-full text-[13px] mt-auto transition-colors"
          >
            SAO CHÉP ẢNH
          </button>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 p-6 flex flex-col items-center justify-center bg-slate-300 relative">
          {items.length === 0 && (
             <div className="absolute top-10 flex items-center gap-2 text-slate-500 text-[13px] font-medium bg-white/60 px-4 py-2 rounded-full shadow-sm z-10 backdrop-blur-sm pointer-events-none">
               <MousePointer2 size={14} /> Kéo thả các hình để di chuyển, click để tùy chỉnh
             </div>
          )}
          <div 
            ref={containerRef} 
            className="w-full h-full bg-white p-2 rounded shadow-[0_10px_25px_rgba(0,0,0,0.1)] relative"
          >
            <Stage 
              width={dimensions.width} 
              height={dimensions.height} 
              onMouseDown={checkDeselect}
              onTouchStart={checkDeselect}
              ref={stageRef}
              className="bg-white rounded"
            >
              <Layer>
                <Rect
                  x={0}
                  y={0}
                  width={dimensions.width}
                  height={dimensions.height}
                  fill="#ffffff"
                  name="background"
                />
                
                {items.map(item => {
                  const props = {
                    key: item.id,
                    item: item as any,
                    isSelected: item.id === selectedId,
                    onSelect: () => setSelectedId(item.id),
                    onDragEnd: handleDragEnd
                  };

                  switch (item.type) {
                    case 'pendulum': return <Pendulum {...props} />;
                    case 'spring_mass': return <SpringMass {...props} />;
                    case 'inclined_plane': return <InclinedPlane {...props} />;
                    case 'pulley': return <Pulley {...props} />;
                    case 'vector': return <Vector {...props} />;
                    case 'graph': return <Graph {...props} />;
                    case 'surface': return <Surfaces {...props} />;
                    case 'rigid_body': return <RigidBodies {...props} />;
                    case 'mechanism': return <Mechanisms {...props} />;
                    case 'physics_vector': return <PhysicsVectors {...props} />;
                    case 'annotation': return <Annotations {...props} />;
                    default: return null;
                  }
                })}
              </Layer>
            </Stage>
            
            {/* Toast Notification */}
            {showToast && (
              <div className="absolute bottom-5 right-5 bg-emerald-600 text-white px-5 py-2.5 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-[14px] z-[100] animate-in fade-in slide-in-from-bottom-4">
                Đã copy thành công! Dán (Ctrl+V) vào Word.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Footer Status Bar */}
      <footer className="h-[28px] shrink-0 bg-slate-50 border-t border-slate-200 flex items-center px-6 text-[11px] text-slate-400 z-20">
        <span>Sẵn sàng • Canvas: {dimensions.width}x{dimensions.height}px • 300 DPI • Anti-aliased</span>
      </footer>
    </div>
  );
}
