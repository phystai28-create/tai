import React from 'react';
import { Group, Arrow, Text, Arc, Circle } from 'react-konva';
import { PhysicsVectorItem } from '../types';

interface Props {
  item: PhysicsVectorItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const PhysicsVectors: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, length, angle, vectorType } = item;

  const getVectorConfig = () => {
    switch (vectorType) {
      case 'gravity': return { color: '#000000', label: 'P', forceAngle: 90 };
      case 'normal': return { color: '#000000', label: 'N', forceAngle: angle };
      case 'friction': return { color: '#000000', label: 'Fms', forceAngle: angle };
      case 'tension': return { color: '#000000', label: 'T', forceAngle: angle };
      case 'velocity': return { color: '#ef4444', label: 'v', forceAngle: angle, width: 2 };
      case 'angular': return { color: '#ef4444', label: 'ω', forceAngle: 0, width: 2, isAngular: true };
      default: return { color: '#000000', label: 'F', forceAngle: angle };
    }
  };

  const config = getVectorConfig();
  const appliedAngle = config.forceAngle;

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
        <Circle x={0} y={0} radius={8} stroke="#3b82f6" strokeWidth={1} dash={[2, 2]} />
      )}
      
      {config.isAngular ? (
        <Group>
          <Arc
            x={0}
            y={0}
            innerRadius={length}
            outerRadius={length}
            angle={270}
            rotation={-135}
            stroke={config.color}
            strokeWidth={config.width || 3}
          />
          {/* Arrow head for arc */}
          <Arrow
            points={[length * Math.cos(135 * Math.PI / 180), length * Math.sin(135 * Math.PI / 180), length * Math.cos(136 * Math.PI / 180), length * Math.sin(136 * Math.PI / 180)]}
            pointerLength={10}
            pointerWidth={8}
            fill={config.color}
            stroke={config.color}
          />
          <Text text={config.label} x={length + 10} y={-10} fontSize={16} fontStyle="italic" fill={config.color} />
        </Group>
      ) : (
        <Group rotation={appliedAngle}>
          <Arrow
            points={[0, 0, length, 0]}
            pointerLength={12}
            pointerWidth={10}
            fill={isSelected ? '#3b82f6' : config.color}
            stroke={isSelected ? '#3b82f6' : config.color}
            strokeWidth={config.width || 3}
          />
          <Text 
            text={config.label} 
            x={length + 5} 
            y={5} 
            fontSize={16} 
            fontStyle="italic" 
            fill={isSelected ? '#3b82f6' : config.color} 
            rotation={-appliedAngle} // Keep text upright
          />
        </Group>
      )}
    </Group>
  );
};

// We need Circle to be imported
