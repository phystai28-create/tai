export type ItemType = 'pendulum' | 'spring_mass' | 'inclined_plane' | 'pulley' | 'vector' | 'graph'
  | 'surface' | 'rigid_body' | 'mechanism' | 'physics_vector' | 'annotation';

export interface BaseItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  rotation?: number;
}

export interface SurfaceItem extends BaseItem {
  type: 'surface';
  surfaceType: 'horizontal' | 'vertical' | 'concave' | 'convex' | 'steps' | 'coordinate';
  width: number;
  height: number;
}

export interface RigidBodyItem extends BaseItem {
  type: 'rigid_body';
  bodyType: 'block' | 'sphere' | 'rod' | 'disk' | 'hoop' | 'cart';
  width: number;
  height: number;
  radius: number;
}

export interface MechanismItem extends BaseItem {
  type: 'mechanism';
  mechanismType: 'string' | 'spring' | 'pivot' | 'pin' | 'rail';
  length: number;
  state?: 'normal' | 'compressed' | 'stretched';
}

export interface PhysicsVectorItem extends BaseItem {
  type: 'physics_vector';
  vectorType: 'force' | 'gravity' | 'normal' | 'friction' | 'tension' | 'velocity' | 'angular';
  length: number;
  angle: number;
}

export interface AnnotationItem extends BaseItem {
  type: 'annotation';
  annotationType: 'com' | 'trajectory' | 'angle' | 'right_angle' | 'dimension' | 'line_of_action' | 'point_mass';
  width: number;
  height: number;
  text?: string;
  radius?: number;
}

export interface PendulumItem extends BaseItem {
  type: 'pendulum';
  length: number;
  angle: number;
  radius: number;
}

export interface SpringMassItem extends BaseItem {
  type: 'spring_mass';
  length: number;
  coils: number;
  massWidth: number;
  massHeight: number;
}

export interface InclinedPlaneItem extends BaseItem {
  type: 'inclined_plane';
  width: number;
  height: number;
  angle: number;
  blockWidth: number;
  blockHeight: number;
}

export interface PulleyItem extends BaseItem {
  type: 'pulley';
  radius: number;
  ropeLength1: number;
  ropeLength2: number;
  massRadius1: number;
  massRadius2: number;
}

export interface VectorItem extends BaseItem {
  type: 'vector';
  length: number;
  angle: number;
}

export interface GraphItem extends BaseItem {
  type: 'graph';
  expression: string;
  width: number;
  height: number;
  xMin: number;
  xMax: number;
}

export type CanvasItem = PendulumItem | SpringMassItem | InclinedPlaneItem | PulleyItem | VectorItem | GraphItem | SurfaceItem | RigidBodyItem | MechanismItem | PhysicsVectorItem | AnnotationItem;
