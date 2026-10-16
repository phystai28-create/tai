import React from 'react';
import { Group, Line, Circle } from 'react-konva';
import { PendulumItem } from '../types';

interface Props {
  item: PendulumItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Pendulum: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, length, angle, radius } = item;

  // Calculate bob position
  const angleRad = (angle * Math.PI) / 180;
  const bobX = length * Math.sin(angleRad);
  const bobY = length * Math.cos(angleRad);

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
        points={[-20, 0, 20, 0]}
        stroke="black"
        strokeWidth={3}
      />
      {/* Dashed lines for ceiling */}
      {[...Array(5)].map((_, i) => (
        <Line
          key={i}
          points={[-15 + i * 8, 0, -10 + i * 8, -10]}
          stroke="black"
          strokeWidth={1.5}
        />
      ))}

      {/* String */}
      <Line
        points={[0, 0, bobX, bobY]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Bob (Sphere) */}
      <Circle
        x={bobX}
        y={bobY}
        radius={radius}
        fillRadialGradientStartPoint={{ x: -radius / 3, y: -radius / 3 }}
        fillRadialGradientStartRadius={0}
        fillRadialGradientEndPoint={{ x: 0, y: 0 }}
        fillRadialGradientEndRadius={radius}
        fillRadialGradientColorStops={[0, '#ffffff', 0.8, '#888888', 1, '#333333']}
        shadowColor="black"
        shadowBlur={10}
        shadowOffsetX={5}
        shadowOffsetY={5}
        shadowOpacity={0.5}
        stroke={isSelected ? '#3b82f6' : undefined}
        strokeWidth={isSelected ? 2 : 0}
      />
    </Group>
  );
};
