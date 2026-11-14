import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialPhysicsState,
  checkAABBOverlap,
  stepPhysics,
  PHYSICS_CONSTANTS,
} from './physics';
import { LevelObstacle } from '../types';

test('createInitialPhysicsState initializes grounded cube at origin', () => {
  const state = createInitialPhysicsState('cube');
  assert.equal(state.x, 0);
  assert.equal(state.y, 0);
  assert.equal(state.mode, 'cube');
  assert.equal(state.isGrounded, true);
  assert.equal(state.gravityDir, 1);
  assert.equal(state.isDead, false);
});

test('checkAABBOverlap detects overlapping and non-overlapping boxes', () => {
  assert.equal(checkAABBOverlap(0, 0, 1, 1, 0.4, 0.4, 1, 1), true);
  assert.equal(checkAABBOverlap(0, 0, 1, 1, 2.0, 0, 1, 1), false);
  assert.equal(checkAABBOverlap(0, 0, 1, 1, 0, 2.0, 1, 1), false);
});

test('Cube jumping applies vertical velocity', () => {
  const initial = createInitialPhysicsState('cube');
  const obstacles: LevelObstacle[] = [];
  const result = stepPhysics(initial, 0.016, true, true, obstacles);

  assert.equal(result.events.jumped, true);
  assert.equal(result.state.isGrounded, false);
  assert.ok(result.state.vy > 10, `Expected vy > 10, got ${result.state.vy}`);
});

test('UFO mode flaps upward in mid-air', () => {
  const initial = createInitialPhysicsState('ufo');
  initial.isGrounded = false;
  initial.y = 5.0;
  initial.vy = -4.0;
  const result = stepPhysics(initial, 0.016, true, true, []);

  assert.equal(result.events.jumped, true);
  assert.equal(result.state.vy, PHYSICS_CONSTANTS.UFO_JUMP_FORCE);
});

test('Yellow jump pad launches player upward', () => {
  const initial = createInitialPhysicsState('cube');
  initial.x = 4.5;
  initial.y = 0;
  const pad: LevelObstacle = {
    id: 1,
    type: 'pad_yellow',
    x: 4.5,
    y: 0,
  };

  const result = stepPhysics(initial, 0.016, false, false, [pad]);
  assert.equal(result.events.hitPad, 'pad_yellow');
  assert.equal(result.state.vy, PHYSICS_CONSTANTS.PAD_YELLOW_FORCE);
});

test('Blue gravity pad inverts gravity direction', () => {
  const initial = createInitialPhysicsState('cube');
  initial.x = 5.0;
  initial.y = 0;
  initial.gravityDir = 1;
  const pad: LevelObstacle = {
    id: 2,
    type: 'pad_blue',
    x: 5.0,
    y: 0,
  };

  const result = stepPhysics(initial, 0.016, false, false, [pad]);
  assert.equal(result.events.hitPad, 'pad_blue');
  assert.equal(result.state.gravityDir, -1);
});

test('Spike collision immediately triggers player death without shield', () => {
  const initial = createInitialPhysicsState('cube');
  initial.x = 2.0;
  initial.y = 0;

  const spike: LevelObstacle = {
    id: 3,
    type: 'spike',
    x: 2.0,
    y: 0,
    width: 1,
    height: 1,
  };

  const result = stepPhysics(initial, 0.016, false, false, [spike]);
  assert.equal(result.events.died, true);
  assert.equal(result.events.deathReason, 'spike');
  assert.equal(result.state.isDead, true);
});

test('Landing safely on solid block snaps position to block top', () => {
  const state = createInitialPhysicsState('cube');
  state.x = 3.0;
  state.y = 1.05;
  state.vy = -5.0;
  state.isGrounded = false;

  const block: LevelObstacle = {
    id: 4,
    type: 'block',
    x: 2.5,
    y: 0,
    width: 2,
    height: 1.0,
  };

  const result = stepPhysics(state, 0.016, false, false, [block]);
  assert.equal(result.state.isGrounded, true);
  assert.equal(result.state.y, 1.0);
  assert.equal(result.state.vy, 0);
  assert.equal(result.events.landed, true);
});

test('Ceiling gravity return portal triggers reliably even when player is on ceiling', () => {
  const state = createInitialPhysicsState('cube');
  state.x = 180;
  state.y = 9.5;
  state.gravityDir = -1;
  state.isGrounded = true;

  const portal: LevelObstacle = {
    id: 314,
    type: 'portal_gravity_down',
    x: 180,
    y: 6.8,
  };

  const result = stepPhysics(state, 0.016, false, false, [portal]);
  assert.equal(result.events.hitPortal, 'portal_gravity_down');
  assert.equal(result.state.gravityDir, 1);
  assert.equal(result.state.isGrounded, false);
});

test('Mini portal activates 0.6x mini mode with adjusted jump and ceiling clamp, and normal portal restores size', () => {
  const state = createInitialPhysicsState('cube');
  state.x = 10.0;
  state.y = 0;

  const miniPortal: LevelObstacle = {
    id: 500,
    type: 'portal_mini',
    x: 10.0,
    y: 0,
  };

  const miniRes = stepPhysics(state, 0.016, false, false, [miniPortal]);
  assert.equal(miniRes.events.hitPortal, 'portal_mini');
  assert.equal(miniRes.state.isMini, true);

  // Next frame in mini mode: jump impulse is scaled to 0.84x
  const miniJumpRes = stepPhysics(miniRes.state, 0.016, true, true, []);
  assert.equal(miniJumpRes.events.jumped, true);
  assert.ok(
    Math.abs(miniJumpRes.state.vy - PHYSICS_CONSTANTS.CUBE_JUMP_FORCE * 0.84) < 1e-6,
    `Expected mini jump vy ${PHYSICS_CONSTANTS.CUBE_JUMP_FORCE * 0.84}, got ${miniJumpRes.state.vy}`
  );

  // Ceiling clamp in mini mode (inverted gravity) leaves 0.6 room instead of 1.0
  const invertedMini = {
    ...miniJumpRes.state,
    gravityDir: -1,
    y: PHYSICS_CONSTANTS.CEILING_Y,
    vy: 5.0,
  };
  const clamped = stepPhysics(invertedMini, 0.016, false, false, []);
  assert.ok(Math.abs(clamped.state.y - (PHYSICS_CONSTANTS.CEILING_Y - 0.6)) < 1e-6);

  // Normal portal restores size
  const normalPortal: LevelObstacle = {
    id: 501,
    type: 'portal_normal',
    x: clamped.state.x,
    y: 0,
  };
  const restored = stepPhysics(clamped.state, 0.016, false, false, [normalPortal]);
  assert.equal(restored.events.hitPortal, 'portal_normal');
  assert.equal(restored.state.isMini, false);
});

test('Teleport portal warps player to targetX/targetY once per portal id', () => {
  const state = createInitialPhysicsState('cube');
  state.x = 20.0;
  state.y = 0.0;
  state.vy = 10.0;

  const tpPortal: LevelObstacle = {
    id: 600,
    type: 'portal_teleport',
    x: 20.0,
    y: 0,
    targetX: 25.0,
    targetY: 6.0,
  };

  const res1 = stepPhysics(state, 0.016, false, false, [tpPortal]);
  assert.equal(res1.events.hitPortal, 'portal_teleport');
  assert.equal(res1.events.teleported, true);
  assert.equal(res1.state.x, 25.0);
  assert.equal(res1.state.y, 6.0);
  assert.equal(res1.state.vy, 0);
  assert.equal(res1.state.lastTeleportId, 600);

  // Subsequent frame should not re-trigger the same portal id
  const res2 = stepPhysics(res1.state, 0.016, false, false, [tpPortal]);
  assert.notEqual(res2.events.teleported, true);
  assert.ok(res2.state.x > 25.0);
});

