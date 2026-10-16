import React from 'react';
import { Group, Line, Rect } from 'react-konva';
import { SpringMassItem } from '../types';

interface Props {
  item: SpringMassItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const SpringMass: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, length, coils, massWidth, massHeight } = item;

  // Generate spring points
  const points = [];
  const coilLength = length / coils;
  const amplitude = 15;

  points.push(0, 0); // Start
  points.push(0, 10); // Straight part at top

  for (let i = 0; i < coils; i++) {
    const startY = 10 + i * coilLength;
    points.push(amplitude, startY + coilLength * 0.25);
    points.push(-amplitude, startY + coilLength * 0.75);
  }

  points.push(0, 10 + length); // Back to center
  points.push(0, 10 + length + 10); // Straight part to mass

  const endY = 10 + length + 10;

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
       {/* Ceiling / Support */}
       <Line
        points={[-30, 0, 30, 0]}
        stroke="black"
        strokeWidth={3}
      />
      {[...Array(7)].map((_, i) => (
        <Line
          key={i}
          points={[-25 + i * 8, 0, -20 + i * 8, -10]}
          stroke="black"
          strokeWidth={1.5}
        />
      ))}

      {/* Spring */}
      <Line
        points={points}
        stroke="black"
        strokeWidth={2}
        lineJoin="round"
        lineCap="round"
      />

      {/* Mass (3D Box) */}
      <Rect
        x={-massWidth / 2}
        y={endY}
        width={massWidth}
        height={massHeight}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: massWidth, y: massHeight }}
        fillLinearGradientColorStops={[0, '#cccccc', 0.5, '#999999', 1, '#555555']}
        shadowColor="black"
        shadowBlur={8}
        shadowOffsetX={4}
        shadowOffsetY={4}
        shadowOpacity={0.4}
        stroke={isSelected ? '#3b82f6' : 'black'}
        strokeWidth={isSelected ? 2 : 1}
      />
    </Group>
  );
};
