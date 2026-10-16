import React from 'react';
import { Group, Line, Rect, Arc, Path, Arrow, Text } from 'react-konva';
import { SurfaceItem } from '../types';

interface Props {
  item: SurfaceItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Surfaces: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, width, height, surfaceType } = item;

  const renderHashMarks = (x1: number, y1: number, x2: number, y2: number, count: number, length: number = 10, angleOffset: number = Math.PI / 4) => {
    const marks = [];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    for (let i = 0; i <= count; i++) {
      const px = x1 + (dx * i) / count;
      const py = y1 + (dy * i) / count;
      marks.push(
        <Line
          key={i}
          points={[px, py, px - length * Math.cos(angle + angleOffset), py - length * Math.sin(angle + angleOffset)]}
          stroke="black"
          strokeWidth={1}
        />
      );
    }
    return marks;
  };

  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onDragEnd(id, e.target.x(), e.target.y());
      }}
    >
      {/* Selection Border */}
      {isSelected && (
        <Rect
          x={-width / 2 - 10}
          y={-height / 2 - 10}
          width={width + 20}
          height={height + 20}
          stroke="#3b82f6"
          strokeWidth={1}
          dash={[5, 5]}
        />
      )}

      {surfaceType === 'horizontal' && (
        <Group x={-width / 2} y={0}>
          <Line points={[0, 0, width, 0]} stroke="black" strokeWidth={3} />
          {renderHashMarks(0, 0, width, 0, Math.floor(width / 15), 15, -Math.PI / 4)}
        </Group>
      )}

      {surfaceType === 'vertical' && (
        <Group x={0} y={-height / 2}>
          <Line points={[0, 0, 0, height]} stroke="black" strokeWidth={3} />
          {renderHashMarks(0, 0, 0, height, Math.floor(height / 15), 15, Math.PI / 4)}
        </Group>
      )}

      {surfaceType === 'concave' && (
        <Group>
          <Arc x={0} y={-height/2} innerRadius={width / 2} outerRadius={width / 2} angle={180} rotation={0} stroke="black" strokeWidth={3} />
          <Arc x={0} y={-height/2} innerRadius={width / 2} outerRadius={width / 2 + 10} angle={180} rotation={0} fillPatternImage={null} stroke="transparent" strokeWidth={0} />
          {/* Approximate hash marks for concave arc could just be multiple lines */}
          {[...Array(10)].map((_, i) => {
            const a = (i / 9) * Math.PI;
            const r = width / 2;
            const px = r * Math.cos(a);
            const py = -height/2 + r * Math.sin(a);
            return <Line key={i} points={[px, py, px + 10 * Math.cos(a), py + 10 * Math.sin(a)]} stroke="black" strokeWidth={1} />;
          })}
        </Group>
      )}

      {surfaceType === 'convex' && (
        <Group>
          <Arc x={0} y={height/2} innerRadius={width / 2} outerRadius={width / 2} angle={180} rotation={180} stroke="black" strokeWidth={3} />
          {[...Array(10)].map((_, i) => {
            const a = Math.PI + (i / 9) * Math.PI;
            const r = width / 2;
            const px = r * Math.cos(a);
            const py = height/2 + r * Math.sin(a);
            return <Line key={i} points={[px, py, px + 10 * Math.cos(a), py + 10 * Math.sin(a)]} stroke="black" strokeWidth={1} />;
          })}
        </Group>
      )}

      {surfaceType === 'steps' && (
        <Group x={-width/2} y={-height/2}>
          <Path
            data={`M 0 ${height} L ${width/2} ${height} L ${width/2} ${height/2} L ${width} ${height/2} L ${width} 0`}
            stroke="black"
            strokeWidth={3}
          />
        </Group>
      )}

      {surfaceType === 'coordinate' && (
        <Group x={-width/2} y={height/2}>
          <Arrow points={[0, 0, width, 0]} stroke="black" fill="black" strokeWidth={2} pointerLength={10} pointerWidth={8} />
          <Arrow points={[0, 0, 0, -height]} stroke="black" fill="black" strokeWidth={2} pointerLength={10} pointerWidth={8} />
          <Text text="x" x={width + 5} y={-10} fontSize={14} fontStyle="italic" />
          <Text text="y" x={-15} y={-height - 15} fontSize={14} fontStyle="italic" />
          <Text text="O" x={-15} y={5} fontSize={14} fontStyle="italic" />
        </Group>
      )}
    </Group>
  );
};
