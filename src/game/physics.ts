import { GameMode, LevelObstacle, ObstacleType } from '../types';

export interface PlayerPhysicsState {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotationX: number;
  rotationZ: number;
  targetRotationZ: number;
  mode: GameMode;
  gravityDir: number; // 1 = down (normal), -1 = up (inverted)
  isGrounded: boolean;
  isDead: boolean;
  speedMultiplier: number;
  isMini: boolean;
  coyoteTimer: number;
  jumpBufferTimer: number;
  lastTeleportId?: number;
}

export interface SimulationResult {
  state: PlayerPhysicsState;
  events: {
    jumped: boolean;
    landed: boolean;
    hitPad?: ObstacleType;
    hitOrb?: ObstacleType;
    hitPortal?: ObstacleType;
    teleported?: boolean;
    collectedCoinId?: number;
    died: boolean;
    deathReason?: string;
  };
}

export const PHYSICS_CONSTANTS = {
  PLAYER_SIZE: 1.0,
  BASE_SPEED: 11.2, // Smoother, more relaxed reaction speed
  CUBE_GRAVITY: 52.0, // Slightly floatier, easier to clear spikes
  CUBE_JUMP_FORCE: 16.8, // Generous jump arc
  SHIP_GRAVITY: 20.0, // Smooth, gentle ship gravity
  SHIP_THRUST: 44.0,
  SHIP_MAX_VY: 10.0,
  WAVE_VY_RATIO: 0.9,
  BALL_GRAVITY: 46.0,
  UFO_GRAVITY: 38.0,
  UFO_JUMP_FORCE: 13.5,
  COYOTE_TIME: 0.22, // Very generous coyote time
  JUMP_BUFFER: 0.22, // Early jump taps always register
  PAD_YELLOW_FORCE: 23.5,
  PAD_PINK_FORCE: 16.0,
  ORB_YELLOW_FORCE: 16.5,
  ORB_PINK_FORCE: 12.0,
  ORB_INTERACT_RADIUS: 2.4, // Large, forgiving orb catch radius
  CEILING_Y: 10.5,
  FLOOR_Y: 0.0,
};

export function createInitialPhysicsState(
  mode: GameMode = 'cube'
): PlayerPhysicsState {
  return {
    x: 0,
    y: 0,
    z: 0,
    vx: PHYSICS_CONSTANTS.BASE_SPEED,
    vy: 0,
    vz: 0,
    rotationX: 0,
    rotationZ: 0,
    targetRotationZ: 0,
    mode,
    gravityDir: 1,
    isGrounded: true,
    isDead: false,
    speedMultiplier: 1,
    isMini: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    lastTeleportId: undefined,
  };
}

// Check intersection of two 2D/3D AABBs
export function checkAABBOverlap(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean {
  return (
    Math.abs(x1 - x2) < (w1 + w2) / 2 &&
    Math.abs(y1 - y2) < (h1 + h2) / 2
  );
}

// Distance between 2D points
export function distance2D(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Step the simulation by dt (clamped to max 0.05s).
 */
export function stepPhysics(
  state: PlayerPhysicsState,
  rawDt: number,
  isHoldingJump: boolean,
  justPressedJump: boolean,
  obstacles: LevelObstacle[]
): SimulationResult {
  const dt = Math.min(rawDt, 0.05);
  const next: PlayerPhysicsState = { ...state };
  const events: SimulationResult['events'] = {
    jumped: false,
    landed: false,
    died: false,
  };

  if (next.isDead) {
    return { state: next, events };
  }

  // Update timers
  if (justPressedJump) {
    next.jumpBufferTimer = PHYSICS_CONSTANTS.JUMP_BUFFER;
  } else {
    next.jumpBufferTimer = Math.max(0, next.jumpBufferTimer - dt);
  }

  if (next.isGrounded) {
    next.coyoteTimer = PHYSICS_CONSTANTS.COYOTE_TIME;
  } else {
    next.coyoteTimer = Math.max(0, next.coyoteTimer - dt);
  }

  // Horizontal motion based on speed multiplier
  next.vx = PHYSICS_CONSTANTS.BASE_SPEED * next.speedMultiplier;
  next.x += next.vx * dt;

  const currentPlayerSize = PHYSICS_CONSTANTS.PLAYER_SIZE * (next.isMini ? 0.6 : 1.0);
  const halfSize = currentPlayerSize / 2;
  const playerCenterY = next.y + halfSize;
  const playerCenterX = next.x + halfSize;

  // Handle jump orbs proximity when jump buffer is active
  if (next.jumpBufferTimer > 0) {
    for (const obs of obstacles) {
      if (obs.type.startsWith('orb_')) {
        const orbCenterX = obs.x + 0.5;
        const orbCenterY = obs.y + 0.5;
        const dist = distance2D(playerCenterX, playerCenterY, orbCenterX, orbCenterY);

        if (dist <= PHYSICS_CONSTANTS.ORB_INTERACT_RADIUS) {
          next.jumpBufferTimer = 0; // consume jump
          events.hitOrb = obs.type;

          if (obs.type === 'orb_yellow') {
            next.vy = PHYSICS_CONSTANTS.ORB_YELLOW_FORCE * next.gravityDir;
            next.isGrounded = false;
            next.coyoteTimer = 0;
            events.jumped = true;
          } else if (obs.type === 'orb_pink') {
            next.vy = PHYSICS_CONSTANTS.ORB_PINK_FORCE * next.gravityDir;
            next.isGrounded = false;
            next.coyoteTimer = 0;
            events.jumped = true;
          } else if (obs.type === 'orb_blue') {
            next.gravityDir = (next.gravityDir === 1 ? -1 : 1);
            next.vy = 8.0 * next.gravityDir;
            next.isGrounded = false;
            next.coyoteTimer = 0;
          } else if (obs.type === 'orb_black') {
            next.vy = -26.0 * next.gravityDir;
            next.isGrounded = false;
            next.coyoteTimer = 0;
          }
          break;
        }
      }
    }
  }

  // Mode-specific vertical physics
  const jumpScale = next.isMini ? 0.84 : 1.0;
  const gravityScale = next.isMini ? 1.16 : 1.0;

  switch (next.mode) {
    case 'cube': {
      const wantsToJump = next.jumpBufferTimer > 0 && (next.isGrounded || next.coyoteTimer > 0);
      if (wantsToJump) {
        next.vy = PHYSICS_CONSTANTS.CUBE_JUMP_FORCE * jumpScale * next.gravityDir;
        next.isGrounded = false;
        next.coyoteTimer = 0;
        next.jumpBufferTimer = 0;
        events.jumped = true;
        next.targetRotationZ += Math.PI * 0.5 * (next.gravityDir === 1 ? -1 : 1);
      } else if (!next.isGrounded) {
        next.vy -= PHYSICS_CONSTANTS.CUBE_GRAVITY * gravityScale * next.gravityDir * dt;
        next.rotationZ += (next.isMini ? 10.0 : 7.8) * dt * (next.gravityDir === 1 ? -1 : 1);
      } else {
        next.rotationZ = Math.round(next.rotationZ / (Math.PI / 2)) * (Math.PI / 2);
      }
      break;
    }

    case 'ship': {
      if (isHoldingJump) {
        next.vy += PHYSICS_CONSTANTS.SHIP_THRUST * gravityScale * next.gravityDir * dt;
      } else {
        next.vy -= PHYSICS_CONSTANTS.SHIP_GRAVITY * gravityScale * next.gravityDir * dt;
      }
      next.vy = Math.max(-PHYSICS_CONSTANTS.SHIP_MAX_VY, Math.min(PHYSICS_CONSTANTS.SHIP_MAX_VY, next.vy));
      next.rotationZ = (next.vy / PHYSICS_CONSTANTS.SHIP_MAX_VY) * 0.3 * (next.gravityDir === 1 ? 1 : -1);
      next.isGrounded = false;
      break;
    }

    case 'wave': {
      const waveSpeed = next.vx * PHYSICS_CONSTANTS.WAVE_VY_RATIO * (next.isMini ? 1.25 : 1.0);
      if (isHoldingJump) {
        next.vy = waveSpeed * next.gravityDir;
        next.rotationZ = 0.42 * (next.gravityDir === 1 ? 1 : -1);
      } else {
        next.vy = -waveSpeed * next.gravityDir;
        next.rotationZ = -0.42 * (next.gravityDir === 1 ? 1 : -1);
      }
      next.isGrounded = false;
      break;
    }

    case 'ball': {
      const wantsToFlip = next.jumpBufferTimer > 0 && next.isGrounded;
      if (wantsToFlip) {
        next.gravityDir = (next.gravityDir === 1 ? -1 : 1);
        next.isGrounded = false;
        next.jumpBufferTimer = 0;
        next.coyoteTimer = 0;
        next.vy = 2.0 * next.gravityDir;
        events.jumped = true;
      } else if (!next.isGrounded) {
        next.vy -= PHYSICS_CONSTANTS.BALL_GRAVITY * gravityScale * next.gravityDir * dt;
      }
      next.rotationZ -= (next.isMini ? 14.0 : 11.0) * dt * next.gravityDir;
      break;
    }

    case 'ufo': {
      const wantsToFlap = next.jumpBufferTimer > 0;
      if (wantsToFlap) {
        next.vy = PHYSICS_CONSTANTS.UFO_JUMP_FORCE * jumpScale * next.gravityDir;
        next.isGrounded = false;
        next.jumpBufferTimer = 0;
        events.jumped = true;
      } else if (!next.isGrounded) {
        next.vy -= PHYSICS_CONSTANTS.UFO_GRAVITY * gravityScale * next.gravityDir * dt;
      }
      next.rotationZ = (next.vy / 14.0) * 0.22;
      break;
    }
  }

  // Apply vertical velocity
  next.y += next.vy * dt;

  // Floor / Ceiling default limits
  const floorLimit = PHYSICS_CONSTANTS.FLOOR_Y;
  const ceilingLimit = PHYSICS_CONSTANTS.CEILING_Y;

  if (next.gravityDir === 1) {
    if (next.y <= floorLimit) {
      if (!next.isGrounded) events.landed = true;
      next.y = floorLimit;
      next.vy = 0;
      next.isGrounded = true;
    } else {
      next.isGrounded = false;
    }
  } else {
    const topFloor = ceilingLimit - currentPlayerSize;
    if (next.y >= topFloor) {
      if (!next.isGrounded) events.landed = true;
      next.y = topFloor;
      next.vy = 0;
      next.isGrounded = true;
    } else {
      next.isGrounded = false;
    }
  }

  // Ship and Wave ceiling/floor boundary check - gentle bounce/slide instead of death!
  if (next.mode === 'ship' || next.mode === 'wave') {
    if (next.y <= floorLimit) {
      next.y = floorLimit;
      next.vy = 0;
    }
    if (next.y >= ceilingLimit - currentPlayerSize) {
      next.y = ceilingLimit - currentPlayerSize;
      next.vy = 0;
    }
  }

  // Forgiving Player Hitbox (0.52 size instead of 0.78, scaled cleanly for Mini Mode)
  const pBox = {
    x: next.x + halfSize,
    y: next.y + halfSize,
    w: currentPlayerSize * 0.52,
    h: currentPlayerSize * 0.52,
  };

  // Immediate fatal hazard hit (shield protection layer removed)
  const handleHazardHit = (reason: string): boolean => {
    next.isDead = true;
    events.died = true;
    events.deathReason = reason;
    return true;
  };

  for (const obs of obstacles) {
    if (obs.x > next.x + 5 || obs.x + (obs.width || 1) < next.x - 3) {
      continue;
    }

    const obsW = obs.width || 1;
    const obsH = obs.height || 1;
    const obsCenterX = obs.x + obsW / 2;

    // 1. Spikes - much smaller inner hazard box
    if (obs.type === 'spike') {
      const spikeBox = {
        x: obsCenterX,
        y: obs.y + obsH * 0.22,
        w: obsW * 0.32,
        h: obsH * 0.44,
      };
      if (checkAABBOverlap(pBox.x, pBox.y, pBox.w, pBox.h, spikeBox.x, spikeBox.y, spikeBox.w, spikeBox.h)) {
        if (handleHazardHit('spike')) {
          return { state: next, events };
        }
      }
    } else if (obs.type === 'spike_ceiling') {
      const spikeBox = {
        x: obsCenterX,
        y: obs.y + obsH * 0.78,
        w: obsW * 0.32,
        h: obsH * 0.44,
      };
      if (checkAABBOverlap(pBox.x, pBox.y, pBox.w, pBox.h, spikeBox.x, spikeBox.y, spikeBox.w, spikeBox.h)) {
        if (handleHazardHit('spike_ceiling')) {
          return { state: next, events };
        }
      }
    }

    // 2. Solid Blocks - very forgiving top landing
    else if (obs.type === 'block' || obs.type === 'block_half' || obs.type === 'block_step') {
      const blockTop = obs.y + obsH;
      const blockBottom = obs.y;
      const blockLeft = obs.x;
      const blockRight = obs.x + obsW;

      if (
        next.x + currentPlayerSize > blockLeft + 0.1 &&
        next.x < blockRight - 0.1
      ) {
        if (next.gravityDir === 1) {
          const playerFeet = next.y;
          const prevFeet = playerFeet - next.vy * dt;

          if (playerFeet <= blockTop + 0.25 && prevFeet >= blockTop - 0.35 && next.vy <= 0) {
            next.y = blockTop;
            next.vy = 0;
            if (!next.isGrounded) events.landed = true;
            next.isGrounded = true;
          } else if (next.y < blockTop - 0.25 && next.y + currentPlayerSize > blockBottom + 0.25) {
            if (handleHazardHit('block_crash')) {
              return { state: next, events };
            }
          }
        } else {
          const playerHead = next.y + currentPlayerSize;
          const prevHead = playerHead - next.vy * dt;

          if (playerHead >= blockBottom - 0.25 && prevHead <= blockBottom + 0.35 && next.vy >= 0) {
            next.y = blockBottom - currentPlayerSize;
            next.vy = 0;
            if (!next.isGrounded) events.landed = true;
            next.isGrounded = true;
          } else if (next.y + currentPlayerSize > blockBottom + 0.25 && next.y < blockTop - 0.25) {
            if (handleHazardHit('block_crash')) {
              return { state: next, events };
            }
          }
        }
      }
    }

    // 3. Jump Pads
    else if (obs.type.startsWith('pad_')) {
      const padW = 1.0;
      const padH = 0.45;
      const padBox = { x: obs.x + 0.5, y: obs.y + 0.2, w: padW, h: padH };
      if (checkAABBOverlap(pBox.x, pBox.y, pBox.w, pBox.h, padBox.x, padBox.y, padBox.w, padBox.h)) {
        events.hitPad = obs.type;
        if (obs.type === 'pad_yellow') {
          next.vy = PHYSICS_CONSTANTS.PAD_YELLOW_FORCE * next.gravityDir;
          next.isGrounded = false;
          next.coyoteTimer = 0;
        } else if (obs.type === 'pad_pink') {
          next.vy = PHYSICS_CONSTANTS.PAD_PINK_FORCE * next.gravityDir;
          next.isGrounded = false;
          next.coyoteTimer = 0;
        } else if (obs.type === 'pad_blue') {
          next.gravityDir = (next.gravityDir === 1 ? -1 : 1);
          next.vy = 12.0 * next.gravityDir;
          next.isGrounded = false;
          next.coyoteTimer = 0;
        }
      }
    }

    // 4. Portals (Full track vertical gateway from floor to ceiling)
    else if (obs.type.startsWith('portal_')) {
      const portalBox = {
        x: obs.x + 0.5,
        y: PHYSICS_CONSTANTS.CEILING_Y / 2,
        w: 1.2,
        h: PHYSICS_CONSTANTS.CEILING_Y + 1.0,
      };
      if (checkAABBOverlap(pBox.x, pBox.y, pBox.w, pBox.h, portalBox.x, portalBox.y, portalBox.w, portalBox.h)) {
        events.hitPortal = obs.type;
        if (obs.type === 'portal_cube') next.mode = 'cube';
        else if (obs.type === 'portal_ship') next.mode = 'ship';
        else if (obs.type === 'portal_wave') next.mode = 'wave';
        else if (obs.type === 'portal_ball') next.mode = 'ball';
        else if (obs.type === 'portal_ufo') next.mode = 'ufo';
        else if (obs.type === 'portal_gravity_up') {
          if (next.gravityDir !== -1) {
            next.gravityDir = -1;
            next.isGrounded = false;
            next.coyoteTimer = 0;
            next.vy = 4.0;
          }
        }
        else if (obs.type === 'portal_gravity_down') {
          if (next.gravityDir !== 1) {
            next.gravityDir = 1;
            next.isGrounded = false;
            next.coyoteTimer = 0;
            next.vy = -4.0;
          }
        }
        else if (obs.type === 'portal_speed_1x') next.speedMultiplier = 1;
        else if (obs.type === 'portal_speed_2x') next.speedMultiplier = 1.35;
        else if (obs.type === 'portal_speed_3x') next.speedMultiplier = 1.65;
        else if (obs.type === 'portal_mini') next.isMini = true;
        else if (obs.type === 'portal_normal') next.isMini = false;
        else if (obs.type === 'portal_teleport') {
          if (next.lastTeleportId !== obs.id) {
            next.lastTeleportId = obs.id;
            next.x = obs.targetX ?? obs.x + 1.5;
            next.y = obs.targetY ?? 5.5;
            next.vy = 0;
            next.isGrounded = false;
            events.teleported = true;
          }
        }
      }
    }

    // 5. Coins
    else if (obs.type === 'coin' && !obs.collected) {
      const coinBox = { x: obs.x + 0.5, y: obs.y + 0.5, w: 1.2, h: 1.2 };
      if (checkAABBOverlap(pBox.x, pBox.y, pBox.w, pBox.h, coinBox.x, coinBox.y, coinBox.w, coinBox.h)) {
        obs.collected = true;
        events.collectedCoinId = obs.id;
      }
    }
  }

  return { state: next, events };
}
