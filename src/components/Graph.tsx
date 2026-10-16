import React, { useMemo } from 'react';
import { Group, Line, Text } from 'react-konva';
import * as math from 'mathjs';
import { GraphItem } from '../types';

interface Props {
  item: GraphItem;
  onDragEnd: (id: string, x: number, y: number) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const Graph: React.FC<Props> = ({ item, onDragEnd, isSelected, onSelect }) => {
  const { id, x, y, expression, width, height, xMin, xMax } = item;

  const points = useMemo(() => {
    try {
      const node = math.parse(expression);
      const code = node.compile();
      
      const pts = [];
      const steps = 100;
      const xRange = xMax - xMin;
      const stepSize = xRange / steps;
      
      let yMinCalc = Infinity;
      let yMaxCalc = -Infinity;
      
      const rawPoints: {x: number, y: number}[] = [];

      for (let i = 0; i <= steps; i++) {
        const xVal = xMin + i * stepSize;
        try {
          // Replace commonly used variables with x if they used t or v
          const scope = { x: xVal, t: xVal, v: xVal };
          const yVal = code.evaluate(scope);
          
          if (typeof yVal === 'number' && !isNaN(yVal) && isFinite(yVal)) {
            rawPoints.push({ x: xVal, y: yVal });
            if (yVal < yMinCalc) yMinCalc = yVal;
            if (yVal > yMaxCalc) yMaxCalc = yVal;
          }
        } catch (err) {
          // Ignore eval errors for specific points
        }
      }

      if (rawPoints.length === 0) return [];

      // Add padding to Y range
      const yRange = yMaxCalc - yMinCalc === 0 ? 10 : yMaxCalc - yMinCalc;
      const yPad = yRange * 0.1;
      const yMinFixed = yMinCalc - yPad;
      const yMaxFixed = yMaxCalc + yPad;
      const finalYRange = yMaxFixed - yMinFixed;

      // Scale points to fit width/height
      for (const p of rawPoints) {
        const scaledX = ((p.x - xMin) / xRange) * width;
        const scaledY = height - ((p.y - yMinFixed) / finalYRange) * height;
        pts.push(scaledX, scaledY);
      }

      return pts;
    } catch (e) {
      console.error("Failed to parse expression", e);
      return [];
    }
  }, [expression, width, height, xMin, xMax]);

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
      {/* Background/Border to show selected state */}
      {isSelected && (
        <Line
          points={[0, 0, width, 0, width, height, 0, height]}
          closed
          stroke="#3b82f6"
          strokeWidth={1}
          dash={[5, 5]}
        />
      )}
      
      {/* Axes */}
      {/* Y Axis */}
      <Line points={[0, 0, 0, height]} stroke="black" strokeWidth={2} />
      {/* X Axis */}
      <Line points={[0, height, width, height]} stroke="black" strokeWidth={2} />
      
      {/* Arrows for axes */}
      <Line points={[-5, 5, 0, 0, 5, 5]} stroke="black" strokeWidth={2} />
      <Line points={[width - 5, height - 5, width, height, width - 5, height + 5]} stroke="black" strokeWidth={2} />

      {/* Axis Labels */}
      <Text x={width + 10} y={height - 5} text="x" fontSize={14} fontStyle="italic" />
      <Text x={-15} y={-15} text="y" fontSize={14} fontStyle="italic" />

      {/* Grid lines (simplified) */}
      <Line points={[0, height/2, width, height/2]} stroke="#e5e7eb" strokeWidth={1} />
      <Line points={[width/2, 0, width/2, height]} stroke="#e5e7eb" strokeWidth={1} />

      {/* The Curve */}
      {points.length > 0 && (
        <Line
          points={points}
          stroke="black"
          strokeWidth={3}
          lineJoin="round"
          lineCap="round"
          tension={0.5}
        />
      )}
      
      {/* Expression Text */}
      <Text x={10} y={10} text={`y = ${expression}`} fontSize={14} fill="#4b5563" />
    </Group>
  );
};
