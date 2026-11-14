import * as THREE from 'three';
import { GameMode, ObstacleType, PlayerCustomization } from '../types';

/**
 * Procedural 3D Composite Models for Geometry Dash 3D.
 * Adheres strictly to Three.js composite 3-12 part guidelines.
 */

// Helper to create glowing materials
export function createEmissiveMaterial(color: string | number, emissiveIntensity = 0.8) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    roughness: 0.2,
    metalness: 0.4,
  });
}

/**
 * Build 3D Composite Player model with 4-8 distinct parts.
 */
export function createPlayerMesh(mode: GameMode, cust: PlayerCustomization): THREE.Group {
  const group = new THREE.Group();
  group.name = 'player';

  const primaryCol = new THREE.Color(cust.primaryColor);
  const secondaryCol = new THREE.Color(cust.secondaryColor);
  const glowCol = new THREE.Color(cust.glowColor);

  const primaryMat = new THREE.MeshStandardMaterial({
    color: primaryCol,
    roughness: 0.25,
    metalness: 0.35,
  });

  const secondaryMat = new THREE.MeshStandardMaterial({
    color: secondaryCol,
    roughness: 0.3,
    metalness: 0.5,
  });

  const emissiveMat = new THREE.MeshStandardMaterial({
    color: glowCol,
    emissive: glowCol,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    metalness: 0.1,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: 0x222228,
    roughness: 0.6,
    metalness: 0.8,
  });

  switch (mode) {
    case 'cube': {
      // 1. Primary outer body (Cube: 0.9 x 0.9 x 0.9)
      const bodyGeo = new THREE.BoxGeometry(0.88, 0.88, 0.88);
      const body = new THREE.Mesh(bodyGeo, primaryMat);
      body.position.y = 0.45;
      body.castShadow = true;
      group.add(body);

      // 2. Front face inset panel
      const faceGeo = new THREE.BoxGeometry(0.72, 0.72, 0.05);
      const face = new THREE.Mesh(faceGeo, secondaryMat);
      face.position.set(0, 0.45, 0.43);
      group.add(face);

      // 3. Eyes (left & right)
      const eyeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.04);
      const leftEye = new THREE.Mesh(eyeGeo, emissiveMat);
      leftEye.position.set(-0.2, 0.54, 0.46);
      const rightEye = new THREE.Mesh(eyeGeo, emissiveMat);
      rightEye.position.set(0.2, 0.54, 0.46);
      group.add(leftEye, rightEye);

      // 4. Mouth / Visor
      const mouthGeo = new THREE.BoxGeometry(0.42, 0.12, 0.04);
      const mouth = new THREE.Mesh(mouthGeo, emissiveMat);
      mouth.position.set(0, 0.34, 0.46);
      group.add(mouth);

      // 5. Four Corner Brackets / Tech Studs
      const studGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const offsets = [
        [-0.42, 0.86, 0.42],
        [0.42, 0.86, 0.42],
        [-0.42, 0.04, 0.42],
        [0.42, 0.04, 0.42],
      ];
      offsets.forEach(([ox, oy, oz]) => {
        const stud = new THREE.Mesh(studGeo, metalMat);
        stud.position.set(ox, oy, oz);
        group.add(stud);
      });

      // 6. Bottom Thruster nozzle
      const thrusterGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.12, 8);
      const thruster = new THREE.Mesh(thrusterGeo, metalMat);
      thruster.position.y = 0.04;
      group.add(thruster);
      break;
    }

    case 'ship': {
      // 1. Sleek Dart Hull
      const hullGeo = new THREE.ConeGeometry(0.45, 1.4, 6);
      hullGeo.rotateX(Math.PI / 2);
      const hull = new THREE.Mesh(hullGeo, primaryMat);
      hull.position.set(0, 0.45, 0);
      hull.castShadow = true;
      group.add(hull);

      // 2. Cockpit Glass Canopy
      const canopyGeo = new THREE.SphereGeometry(0.25, 12, 10);
      canopyGeo.scale(0.8, 1.2, 1.6);
      const canopy = new THREE.Mesh(canopyGeo, emissiveMat);
      canopy.position.set(0, 0.58, 0.1);
      group.add(canopy);

      // 3. Swept Wings (Left & Right)
      const wingGeo = new THREE.BoxGeometry(1.4, 0.06, 0.45);
      const wings = new THREE.Mesh(wingGeo, secondaryMat);
      wings.position.set(0, 0.45, -0.15);
      wings.rotation.x = -0.15;
      group.add(wings);

      // 4. Vertical Tail Fin
      const finGeo = new THREE.BoxGeometry(0.06, 0.5, 0.4);
      const fin = new THREE.Mesh(finGeo, secondaryMat);
      fin.position.set(0, 0.72, -0.4);
      group.add(fin);

      // 5. Dual Jet Thrusters
      const thrusterGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.35, 8);
      thrusterGeo.rotateX(Math.PI / 2);
      const leftT = new THREE.Mesh(thrusterGeo, metalMat);
      leftT.position.set(-0.25, 0.45, -0.6);
      const rightT = new THREE.Mesh(thrusterGeo, metalMat);
      rightT.position.set(0.25, 0.45, -0.6);
      group.add(leftT, rightT);

      // 6. Glowing Plasma Exhausts
      const flameGeo = new THREE.ConeGeometry(0.1, 0.4, 8);
      flameGeo.rotateX(-Math.PI / 2);
      const flameL = new THREE.Mesh(flameGeo, emissiveMat);
      flameL.position.set(-0.25, 0.45, -0.85);
      const flameR = new THREE.Mesh(flameGeo, emissiveMat);
      flameR.position.set(0.25, 0.45, -0.85);
      group.add(flameL, flameR);
      break;
    }

    case 'wave': {
      // 1. Sharp Delta Arrowhead
      const arrowGeo = new THREE.ConeGeometry(0.48, 1.2, 4);
      arrowGeo.rotateZ(Math.PI / 4);
      arrowGeo.rotateX(Math.PI / 2);
      const arrow = new THREE.Mesh(arrowGeo, primaryMat);
      arrow.position.set(0, 0.45, 0);
      arrow.castShadow = true;
      group.add(arrow);

      // 2. Central Glowing Energy Spine
      const spineGeo = new THREE.BoxGeometry(0.08, 0.15, 1.1);
      const spine = new THREE.Mesh(spineGeo, emissiveMat);
      spine.position.set(0, 0.52, 0);
      group.add(spine);

      // 3. Side Wings with secondary trim
      const finGeo = new THREE.BoxGeometry(0.9, 0.05, 0.4);
      const sideFins = new THREE.Mesh(finGeo, secondaryMat);
      sideFins.position.set(0, 0.45, -0.2);
      group.add(sideFins);

      // 4. Rear Engine Ring
      const ringGeo = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
      const ring = new THREE.Mesh(ringGeo, metalMat);
      ring.position.set(0, 0.45, -0.55);
      group.add(ring);
      break;
    }

    case 'ball': {
      // 1. Outer Toothed Rim / Gear
      const gearGeo = new THREE.TorusGeometry(0.42, 0.08, 8, 24);
      const gear = new THREE.Mesh(gearGeo, metalMat);
      gear.position.set(0, 0.45, 0);
      group.add(gear);

      // 2. Inner Rotating Core Sphere
      const sphereGeo = new THREE.SphereGeometry(0.38, 16, 14);
      const core = new THREE.Mesh(sphereGeo, primaryMat);
      core.position.set(0, 0.45, 0);
      core.castShadow = true;
      group.add(core);

      // 3. Dual Crossed Neon Equatorial Bands
      const bandGeo = new THREE.TorusGeometry(0.39, 0.04, 6, 20);
      const band1 = new THREE.Mesh(bandGeo, emissiveMat);
      band1.position.set(0, 0.45, 0);
      const band2 = new THREE.Mesh(bandGeo, secondaryMat);
      band2.position.set(0, 0.45, 0);
      band2.rotation.y = Math.PI / 2;
      group.add(band1, band2);

      // 4. Hub Caps
      const hubGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.8, 8);
      hubGeo.rotateZ(Math.PI / 2);
      const hub = new THREE.Mesh(hubGeo, metalMat);
      hub.position.set(0, 0.45, 0);
      group.add(hub);
      break;
    }

    case 'ufo': {
      // 1. Saucer Rim
      const rimGeo = new THREE.CylinderGeometry(0.55, 0.42, 0.18, 16);
      const saucer = new THREE.Mesh(rimGeo, primaryMat);
      saucer.position.set(0, 0.35, 0);
      saucer.castShadow = true;
      group.add(saucer);

      // 2. Glowing Glass Dome
      const domeGeo = new THREE.SphereGeometry(0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
      const dome = new THREE.Mesh(domeGeo, emissiveMat);
      dome.position.set(0, 0.43, 0);
      group.add(dome);

      // 3. Stabilizer Ring
      const ringGeo = new THREE.TorusGeometry(0.52, 0.04, 8, 20);
      ringGeo.rotateX(Math.PI / 2);
      const ring = new THREE.Mesh(ringGeo, secondaryMat);
      ring.position.set(0, 0.35, 0);
      group.add(ring);
      break;
    }
  }

  // Soft Contact Shadow Disc beneath player (directive compliant)
  const shadowGeo = new THREE.CircleGeometry(0.55, 16);
  shadowGeo.rotateX(-Math.PI / 2);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.45,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = 0.015;
  group.add(shadow);

  return group;
}

/**
 * 3D Composite Spike with beveled base and glowing neon tip.
 */
export function createSpikeMesh(isCeiling = false, color = 0xef4444): THREE.Group {
  const group = new THREE.Group();

  // 1. Base pedestal
  const baseGeo = new THREE.BoxGeometry(0.9, 0.15, 0.9);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.7,
    metalness: 0.5,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = isCeiling ? -0.075 : 0.075;
  group.add(base);

  // 2. Pyramid Spike
  const spikeGeo = new THREE.ConeGeometry(0.42, 0.95, 4);
  spikeGeo.rotateY(Math.PI / 4);
  if (isCeiling) {
    spikeGeo.rotateX(Math.PI);
  }
  const spikeMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
    roughness: 0.25,
    metalness: 0.4,
  });
  const spike = new THREE.Mesh(spikeGeo, spikeMat);
  spike.position.y = isCeiling ? -0.55 : 0.55;
  spike.castShadow = true;
  group.add(spike);

  // 3. Glowing neon tip
  const tipGeo = new THREE.SphereGeometry(0.08, 8, 6);
  const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const tip = new THREE.Mesh(tipGeo, tipMat);
  tip.position.y = isCeiling ? -1.02 : 1.02;
  group.add(tip);

  return group;
}

/**
 * 3D Composite Solid Block with cyber neon edge bevels.
 */
export function createBlockMesh(
  width = 1,
  height = 1,
  primaryColor = 0x06b6d4,
  secondaryColor = 0x0284c7
): THREE.Group {
  const group = new THREE.Group();

  // 1. Inner core block
  const coreGeo = new THREE.BoxGeometry(width, height, 1.2);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.8,
    metalness: 0.2,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.position.set(width / 2, height / 2, 0);
  core.receiveShadow = true;
  group.add(core);

  // 2. Glowing Neon Border Frame
  const frameGeo = new THREE.BoxGeometry(width * 0.98, height * 0.98, 1.22);
  const edges = new THREE.EdgesGeometry(frameGeo);
  const lineMat = new THREE.LineBasicMaterial({
    color: primaryColor,
    linewidth: 2,
  });
  const wireframe = new THREE.LineSegments(edges, lineMat);
  wireframe.position.set(width / 2, height / 2, 0);
  group.add(wireframe);

  // 3. Inset tech panel
  const panelGeo = new THREE.PlaneGeometry(width * 0.7, height * 0.7);
  const panelMat = new THREE.MeshStandardMaterial({
    color: secondaryColor,
    emissive: secondaryColor,
    emissiveIntensity: 0.2,
    roughness: 0.5,
  });
  const frontPanel = new THREE.Mesh(panelGeo, panelMat);
  frontPanel.position.set(width / 2, height / 2, 0.61);
  group.add(frontPanel);

  return group;
}

/**
 * 3D Jump Orb (Yellow, Pink, Blue, Black).
 */
export function createOrbMesh(type: ObstacleType): THREE.Group {
  const group = new THREE.Group();

  let color = 0xeab308; // Yellow
  if (type === 'orb_pink') color = 0xec4899;
  if (type === 'orb_blue') color = 0x06b6d4;
  if (type === 'orb_black') color = 0x18181b;

  // 1. Outer Gimbal Ring
  const ringGeo = new THREE.TorusGeometry(0.48, 0.05, 8, 20);
  const ringMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.8,
    metalness: 0.5,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.name = 'orbRing';
  group.add(ring);

  // 2. Inner Crystal Core
  const coreGeo = new THREE.OctahedronGeometry(0.3, 0);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: color,
    emissiveIntensity: 1.5,
    roughness: 0.1,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.name = 'orbCore';
  group.add(core);

  // 3. Pulsing Halo Aura
  const haloGeo = new THREE.RingGeometry(0.35, 0.6, 20);
  const haloMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.35,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.name = 'orbHalo';
  group.add(halo);

  return group;
}

/**
 * 3D Jump Pad (Yellow, Pink, Blue).
 */
export function createPadMesh(type: ObstacleType): THREE.Group {
  const group = new THREE.Group();

  let color = 0xeab308;
  if (type === 'pad_pink') color = 0xec4899;
  if (type === 'pad_blue') color = 0x06b6d4;

  // 1. Metal base housing
  const baseGeo = new THREE.CylinderGeometry(0.5, 0.55, 0.12, 16);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.7,
    metalness: 0.6,
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.06;
  group.add(base);

  // 2. Pressure plate
  const plateGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.06, 16);
  const plateMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });
  const plate = new THREE.Mesh(plateGeo, plateMat);
  plate.position.y = 0.15;
  group.add(plate);

  // 3. Upward Chevron indicator
  const arrowGeo = new THREE.ConeGeometry(0.18, 0.25, 3);
  const arrowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const arrow = new THREE.Mesh(arrowGeo, arrowMat);
  arrow.position.set(0, 0.28, 0);
  group.add(arrow);

  return group;
}

/**
 * 3D Mode / Gravity / Speed Portal.
 */
export function createPortalMesh(type: ObstacleType, overrideColor?: number): THREE.Group {
  const group = new THREE.Group();

  let color = 0x22c55e; // Cube green
  if (type === 'portal_ship') color = 0xec4899; // Ship pink
  if (type === 'portal_wave') color = 0x06b6d4; // Wave cyan
  if (type === 'portal_ball') color = 0xf97316; // Ball orange
  if (type === 'portal_ufo') color = 0xa855f7; // UFO purple
  if (type === 'portal_gravity_up') color = 0x3b82f6; // Blue gravity
  if (type === 'portal_gravity_down') color = 0xeab308; // Yellow gravity
  if (type === 'portal_speed_1x') color = 0x38bdf8;
  if (type === 'portal_speed_2x') color = 0xfacc15;
  if (type === 'portal_speed_3x') color = 0xf97316;
  if (type === 'portal_mini') color = 0xd946ef; // Magenta mini
  if (type === 'portal_normal') color = 0x4ade80; // Lime normal
  if (type === 'portal_teleport') color = 0x06b6d4; // Cyan teleport entrance
  if (overrideColor !== undefined) color = overrideColor;

  // 1. Portal Arch Ring
  const archGeo = new THREE.TorusGeometry(1.0, 0.1, 10, 24);
  archGeo.scale(0.75, 1.3, 1.0);
  const archMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.8,
  });
  const arch = new THREE.Mesh(archGeo, archMat);
  arch.position.y = 1.4;
  group.add(arch);

  // 2. Swirling Vortex Center
  const vortexGeo = new THREE.CircleGeometry(0.75, 20);
  vortexGeo.scale(0.75, 1.25, 1.0);
  const vortexMat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const vortex = new THREE.Mesh(vortexGeo, vortexMat);
  vortex.position.y = 1.4;
  vortex.name = 'portalVortex';
  group.add(vortex);

  // 3. Neon Rim Emitter
  const rimGeo = new THREE.TorusGeometry(1.0, 0.045, 8, 24);
  rimGeo.scale(0.74, 1.29, 1.0);
  const rimMat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 1.5,
  });
  const rim = new THREE.Mesh(rimGeo, rimMat);
  rim.position.y = 1.4;
  group.add(rim);

  return group;
}

/**
 * 3D Secret Gold Star Coin.
 */
export function createCoinMesh(): THREE.Group {
  const group = new THREE.Group();

  // 1. Outer Gold Coin Rim
  const coinGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.12, 20);
  coinGeo.rotateX(Math.PI / 2);
  const coinMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
  });
  const coin = new THREE.Mesh(coinGeo, coinMat);
  coin.castShadow = true;
  group.add(coin);

  // 2. Embossed Star
  const starGeo = new THREE.ConeGeometry(0.22, 0.14, 5);
  starGeo.rotateX(Math.PI / 2);
  const starMat = new THREE.MeshStandardMaterial({
    color: 0xfef08a,
    emissive: 0xfef08a,
    emissiveIntensity: 0.9,
  });
  const star = new THREE.Mesh(starGeo, starMat);
  star.position.z = 0.04;
  group.add(star);

  // 3. Outer Halo Glow
  const haloGeo = new THREE.RingGeometry(0.46, 0.65, 18);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  group.add(halo);

  return group;
}
