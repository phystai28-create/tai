import React from 'react';
import { Group, Rect, Circle, Line } from 'react-konva';
import { RigidBodyItem } from '../types';

interface Props {
  item: RigidBodyItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const RigidBodies: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, width, height, radius, bodyType } = item;

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
          x={-Math.max(width, radius*2) / 2 - 5}
          y={-Math.max(height, radius*2) / 2 - 5}
          width={Math.max(width, radius*2) + 10}
          height={Math.max(height, radius*2) + 10}
          stroke="#3b82f6"
          strokeWidth={1}
          dash={[5, 5]}
        />
      )}

      {bodyType === 'block' && (
        <Rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: width, y: height }}
          fillLinearGradientColorStops={[0, '#f3f4f6', 1, '#9ca3af']}
          stroke="black"
          strokeWidth={2}
          shadowColor="rgba(0,0,0,0.5)"
          shadowBlur={10}
          shadowOffsetX={5}
          shadowOffsetY={5}
        />
      )}

      {bodyType === 'sphere' && (
        <Circle
          x={0}
          y={0}
          radius={radius}
          fillRadialGradientStartPoint={{ x: -radius / 3, y: -radius / 3 }}
          fillRadialGradientStartRadius={0}
          fillRadialGradientEndPoint={{ x: 0, y: 0 }}
          fillRadialGradientEndRadius={radius}
          fillRadialGradientColorStops={[0, '#ffffff', 0.8, '#9ca3af', 1, '#4b5563']}
          stroke="black"
          strokeWidth={1}
          shadowColor="rgba(0,0,0,0.5)"
          shadowBlur={10}
          shadowOffsetX={5}
          shadowOffsetY={5}
        />
      )}

      {bodyType === 'rod' && (
        <Rect
          x={-width / 2}
          y={-height / 2}
          width={width}
          height={height}
          fill="#d1d5db"
          stroke="black"
          strokeWidth={2}
        />
      )}

      {bodyType === 'disk' && (
        <Group>
          <Circle
            x={0}
            y={0}
            radius={radius}
            fill="#e5e7eb"
            stroke="black"
            strokeWidth={2}
          />
          <Circle x={0} y={0} radius={4} fill="black" />
          <Circle x={0} y={0} radius={radius * 0.8} stroke="#9ca3af" strokeWidth={1} />
        </Group>
      )}

      {bodyType === 'hoop' && (
        <Group>
          <Circle
            x={0}
            y={0}
            radius={radius}
            stroke="black"
            strokeWidth={4}
          />
          <Circle x={0} y={0} radius={2} fill="black" />
        </Group>
      )}

      {bodyType === 'cart' && (
        <Group>
          <Rect
            x={-width / 2}
            y={-height / 2}
            width={width}
            height={height - radius}
            fill="#cbd5e1"
            stroke="black"
            strokeWidth={2}
          />
          {/* Wheels */}
          <Circle x={-width / 2 + radius + 5} y={height / 2 - radius} radius={radius} fill="#475569" stroke="black" strokeWidth={2} />
          <Circle x={width / 2 - radius - 5} y={height / 2 - radius} radius={radius} fill="#475569" stroke="black" strokeWidth={2} />
        </Group>
      )}
    </Group>
  );
};
