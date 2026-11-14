export type GameMode = 'cube' | 'ship' | 'wave' | 'ball' | 'ufo';

export type GameState =
  | 'title'
  | 'level_select'
  | 'customizer'
  | 'playing'
  | 'paused'
  | 'gameover'
  | 'victory';

export type RenderMode = '2d' | '3d';
export type CameraViewMode = 'classic' | 'chase' | 'iso';

export type ObstacleType =
  | 'spike'
  | 'spike_ceiling'
  | 'spike_half'
  | 'block'
  | 'block_half'
  | 'block_step'
  | 'orb_yellow'
  | 'orb_pink'
  | 'orb_blue'
  | 'orb_black'
  | 'pad_yellow'
  | 'pad_pink'
  | 'pad_blue'
  | 'portal_cube'
  | 'portal_ship'
  | 'portal_wave'
  | 'portal_ball'
  | 'portal_ufo'
  | 'portal_gravity_down'
  | 'portal_gravity_up'
  | 'portal_speed_1x'
  | 'portal_speed_2x'
  | 'portal_speed_3x'
  | 'portal_mini'
  | 'portal_normal'
  | 'portal_teleport'
  | 'coin';

export interface LevelObstacle {
  id: number;
  type: ObstacleType;
  x: number;
  y: number;
  z?: number;
  width?: number;
  height?: number;
  length?: number;
  targetX?: number;
  targetY?: number;
  collected?: boolean;
}

export type Difficulty = 'Easy' | 'Normal' | 'Hard' | 'Harder' | 'Insane' | 'Demon' | 'Extreme Demon';

export interface LevelData {
  id: string;
  name: string;
  vietnameseTitle: string;
  difficulty: Difficulty;
  stars: number;
  bpm: number;
  trackLength: number; // distance in units (e.g. 300)
  baseSpeed: number; // units per second (e.g. 13)
  songArtist: string;
  songTrackName: string;
  primaryColor: string; // hex
  secondaryColor: string; // hex
  floorColor: string;
  bgGradient: [string, string];
  description: string;
  obstacles: LevelObstacle[];
}

export interface PlayerCustomization {
  cubeSkin: string;
  shipSkin: string;
  waveSkin: string;
  ballSkin: string;
  ufoSkin: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  glowEnabled: boolean;
  trailStyle: 'classic' | 'rainbow' | 'fire' | 'particles';
  deathEffect: 'shatter' | 'explosion' | 'implosion';
}

export interface CheckpointData {
  x: number;
  y: number;
  z: number;
  vy: number;
  mode: GameMode;
  gravityDir: number;
  speedMultiplier: number;
  isMini: boolean;
  rotationX: number;
  rotationZ: number;
}
