import React from 'react';
import { Group, Circle, Path, Arc, Line, Text } from 'react-konva';
import { AnnotationItem } from '../types';

interface Props {
  item: AnnotationItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Annotations: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, width, height, radius, text, annotationType } = item;

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
        <Circle x={0} y={0} radius={15} stroke="#3b82f6" strokeWidth={1} dash={[2, 2]} />
      )}

      {annotationType === 'com' && (
        <Group>
          <Circle x={0} y={0} radius={10} stroke="black" strokeWidth={1.5} />
          <Path data="M 0 -10 A 10 10 0 0 1 10 0 L 0 0 Z" fill="black" />
          <Path data="M 0 10 A 10 10 0 0 1 -10 0 L 0 0 Z" fill="black" />
          <Line points={[-12, 0, 12, 0]} stroke="black" strokeWidth={1} />
          <Line points={[0, -12, 0, 12]} stroke="black" strokeWidth={1} />
        </Group>
      )}

      {annotationType === 'trajectory' && (
        <Path
          data={`M 0 0 Q ${width/2} ${-height} ${width} 0`}
          stroke="black"
          strokeWidth={2}
          dash={[5, 5]}
        />
      )}

      {annotationType === 'angle' && (
        <Group>
          <Line points={[0, 0, radius || 50, 0]} stroke="black" strokeWidth={1} />
          <Line points={[0, 0, (radius || 50) * Math.cos(-Math.PI/4), (radius || 50) * Math.sin(-Math.PI/4)]} stroke="black" strokeWidth={1} />
          <Arc x={0} y={0} innerRadius={20} outerRadius={20} angle={45} rotation={-45} stroke="black" strokeWidth={1.5} />
          <Text text={text || "α"} x={25} y={-15} fontSize={14} fontStyle="italic" />
        </Group>
      )}

      {annotationType === 'right_angle' && (
        <Group>
          <Line points={[0, 0, 20, 0]} stroke="black" strokeWidth={1} />
          <Line points={[0, 0, 0, -20]} stroke="black" strokeWidth={1} />
          <Line points={[12, 0, 12, -12, 0, -12]} stroke="black" strokeWidth={1.5} />
        </Group>
      )}

      {annotationType === 'dimension' && (
        <Group>
          <Line points={[0, 0, width, 0]} stroke="black" strokeWidth={1} />
          <Path data={`M 5 -4 L 0 0 L 5 4 M ${width-5} -4 L ${width} 0 L ${width-5} 4`} stroke="black" strokeWidth={1} fill="transparent" />
          <Line points={[0, -5, 0, 5]} stroke="black" strokeWidth={1} />
          <Line points={[width, -5, width, 5]} stroke="black" strokeWidth={1} />
          <Text text={text || "L"} x={width/2 - 5} y={-15} fontSize={14} fontStyle="italic" />
        </Group>
      )}

      {annotationType === 'line_of_action' && (
        <Line points={[0, 0, width, 0]} stroke="black" strokeWidth={1} dash={[10, 5]} />
      )}

      {annotationType === 'point_mass' && (
        <Circle x={0} y={0} radius={4} fill="black" />
      )}
    </Group>
  );
};
