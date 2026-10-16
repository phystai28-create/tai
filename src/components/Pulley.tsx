import React from 'react';
import { Group, Line, Circle, Rect } from 'react-konva';
import { PulleyItem } from '../types';

interface Props {
  item: PulleyItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Pulley: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, radius, ropeLength1, ropeLength2, massRadius1, massRadius2 } = item;

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
        points={[-20, -radius - 20, 20, -radius - 20]}
        stroke="black"
        strokeWidth={3}
      />
      {[...Array(5)].map((_, i) => (
        <Line
          key={i}
          points={[-15 + i * 8, -radius - 20, -10 + i * 8, -radius - 30]}
          stroke="black"
          strokeWidth={1.5}
        />
      ))}

      {/* Support string to pulley center */}
      <Line
        points={[0, -radius - 20, 0, 0]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Ropes */}
      <Line
        points={[-radius, 0, -radius, ropeLength1]}
        stroke="black"
        strokeWidth={2}
      />
      <Line
        points={[radius, 0, radius, ropeLength2]}
        stroke="black"
        strokeWidth={2}
      />

      {/* Pulley Wheel */}
      <Circle
        x={0}
        y={0}
        radius={radius}
        fill="#e0e0e0"
        stroke={isSelected ? '#3b82f6' : 'black'}
        strokeWidth={2}
        shadowColor="black"
        shadowBlur={4}
        shadowOffsetX={2}
        shadowOffsetY={2}
        shadowOpacity={0.3}
      />
      {/* Inner Pulley Details */}
      <Circle x={0} y={0} radius={radius * 0.8} stroke="#ccc" strokeWidth={1} />
      <Circle x={0} y={0} radius={4} fill="black" />

      {/* Mass 1 (Left) */}
      <Rect
        x={-radius - massRadius1}
        y={ropeLength1}
        width={massRadius1 * 2}
        height={massRadius1 * 2}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: massRadius1 * 2, y: massRadius1 * 2 }}
        fillLinearGradientColorStops={[0, '#cccccc', 1, '#666666']}
        stroke="black"
        strokeWidth={1}
        shadowColor="black"
        shadowBlur={4}
        shadowOffsetX={3}
        shadowOffsetY={3}
        shadowOpacity={0.4}
      />

      {/* Mass 2 (Right) */}
      <Rect
        x={radius - massRadius2}
        y={ropeLength2}
        width={massRadius2 * 2}
        height={massRadius2 * 2}
        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
        fillLinearGradientEndPoint={{ x: massRadius2 * 2, y: massRadius2 * 2 }}
        fillLinearGradientColorStops={[0, '#cccccc', 1, '#666666']}
        stroke="black"
        strokeWidth={1}
        shadowColor="black"
        shadowBlur={4}
        shadowOffsetX={3}
        shadowOffsetY={3}
        shadowOpacity={0.4}
      />
    </Group>
  );
};
