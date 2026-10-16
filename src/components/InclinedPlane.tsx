import React from 'react';
import { Group, Line, Rect } from 'react-konva';
import { InclinedPlaneItem } from '../types';

interface Props {
  item: InclinedPlaneItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const InclinedPlane: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, width, height, angle, blockWidth, blockHeight } = item;

  const angleRad = (angle * Math.PI) / 180;
  
  // Triangle points (bottom-left, bottom-right, top-right)
  // Let's make it a right triangle where the hypotenuse is the plane
  // Bottom-left: (0, 0), Bottom-right: (width, 0), Top-right: (width, -width * tan(angle))
  // Wait, if angle is from horizontal, and we want height:
  const actualHeight = width * Math.tan(angleRad);

  // Plane goes from (0,0) down to (width, actualHeight)? No, usually left is higher or right is higher.
  // Let's do right is lower:
  // Top-left: (0, -actualHeight), Bottom-left: (0, 0), Bottom-right: (width, 0)
  
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
      {/* Wedge / Plane */}
      <Line
        points={[0, -actualHeight, 0, 0, width, 0]}
        closed
        fill="#f0f0f0"
        stroke={isSelected ? '#3b82f6' : 'black'}
        strokeWidth={2}
        shadowColor="black"
        shadowBlur={5}
        shadowOffsetX={2}
        shadowOffsetY={2}
        shadowOpacity={0.2}
      />
      {/* Angle arc */}
      {/* Block on plane */}
      <Group
        x={width / 2}
        y={- (width / 2) * Math.tan(angleRad)}
        rotation={angle}
      >
        <Rect
          x={-blockWidth / 2}
          y={-blockHeight}
          width={blockWidth}
          height={blockHeight}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: blockWidth, y: blockHeight }}
          fillLinearGradientColorStops={[0, '#ff9999', 1, '#cc0000']}
          stroke="black"
          strokeWidth={1}
          shadowColor="black"
          shadowBlur={4}
          shadowOffsetX={2}
          shadowOffsetY={2}
          shadowOpacity={0.4}
        />
      </Group>
    </Group>
  );
};
