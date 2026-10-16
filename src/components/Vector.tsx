import React from 'react';
import { Group, Arrow } from 'react-konva';
import { VectorItem } from '../types';

interface Props {
  item: VectorItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Vector: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, length, angle } = item;

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
      rotation={angle}
    >
      <Arrow
        points={[0, 0, length, 0]}
        pointerLength={15}
        pointerWidth={10}
        fill={isSelected ? '#3b82f6' : 'black'}
        stroke={isSelected ? '#3b82f6' : 'black'}
        strokeWidth={3}
        shadowColor="black"
        shadowBlur={2}
        shadowOffsetX={1}
        shadowOffsetY={1}
        shadowOpacity={0.3}
      />
    </Group>
  );
};
