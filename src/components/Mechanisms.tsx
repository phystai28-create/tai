import React from 'react';
import { Group, Line, Circle, Path } from 'react-konva';
import { MechanismItem } from '../types';

interface Props {
  item: MechanismItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Mechanisms: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, length, mechanismType, state } = item;

  const renderSpring = () => {
    const points = [0, 0, 0, 10];
    const coils = state === 'compressed' ? 12 : state === 'stretched' ? 5 : 8;
    const amplitude = 15;
    const coilLength = (length - 20) / coils;

    for (let i = 0; i < coils; i++) {
      const startY = 10 + i * coilLength;
      points.push(amplitude, startY + coilLength * 0.25);
      points.push(-amplitude, startY + coilLength * 0.75);
    }
    points.push(0, length - 10, 0, length);
    return points;
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
      {isSelected && (
        <Circle x={0} y={0} radius={10} stroke="#3b82f6" strokeWidth={1} dash={[2, 2]} />
      )}

      {mechanismType === 'string' && (
        <Line points={[0, 0, 0, length]} stroke="black" strokeWidth={2} />
      )}

      {mechanismType === 'spring' && (
        <Line
          points={renderSpring()}
          stroke="black"
          strokeWidth={2}
          lineJoin="round"
          lineCap="round"
        />
      )}

      {mechanismType === 'pivot' && (
        <Group>
          <Path
            data="M -15 20 L 15 20 L 0 0 Z"
            fill="#e2e8f0"
            stroke="black"
            strokeWidth={2}
          />
          <Circle x={0} y={0} radius={4} fill="white" stroke="black" strokeWidth={2} />
        </Group>
      )}

      {mechanismType === 'pin' && (
        <Group>
          <Circle x={0} y={0} radius={6} fill="white" stroke="black" strokeWidth={2} />
          <Line points={[-4, -4, 4, 4]} stroke="black" strokeWidth={1.5} />
          <Line points={[-4, 4, 4, -4]} stroke="black" strokeWidth={1.5} />
        </Group>
      )}

      {mechanismType === 'rail' && (
        <Group>
          <Line points={[-length/2, -5, length/2, -5]} stroke="#94a3b8" strokeWidth={3} />
          <Line points={[-length/2, 5, length/2, 5]} stroke="#94a3b8" strokeWidth={3} />
        </Group>
      )}
    </Group>
  );
};
