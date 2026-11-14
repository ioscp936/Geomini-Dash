import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CameraViewMode, GameMode, LevelData, PlayerCustomization } from '../types';
import {
  createBlockMesh,
  createCoinMesh,
  createOrbMesh,
  createPadMesh,
  createPlayerMesh,
  createPortalMesh,
  createSpikeMesh,
} from './models';
import { PlayerPhysicsState } from './physics';

// Reusable scratch vectors to ensure zero GC in animation loop
const _vec3 = new THREE.Vector3();
const _targetCam = new THREE.Vector3();
const _camLook = new THREE.Vector3();

export interface Particle {
  active: boolean;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  color: THREE.Color;
}

export class GameRenderer {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private isSoftwareGl: boolean;
  private frameId: number = 0;

  // Lights
  private dirLight: THREE.DirectionalLight;
  private hemiLight: THREE.HemisphereLight;

  // Scene Objects
  private playerGroup: THREE.Group | null = null;
  private currentMode: GameMode = 'cube';
  private currentCustomization: PlayerCustomization;
  private trackGroup: THREE.Group;
  private bgGroup: THREE.Group;
  private particlesGroup: THREE.Group;
  private particlePool: Particle[] = [];
  private particleMeshes: THREE.Mesh[] = [];

  // Track & Obstacle meshes
  private obstacleMeshes: Map<number, THREE.Group> = new Map();
  private floorGridMesh: THREE.GridHelper | null = null;
  private floorPlane: THREE.Mesh | null = null;
  private ceilingPlane: THREE.Mesh | null = null;

  // Camera & Shake state
  private viewMode: CameraViewMode = 'chase';
  private cameraTrauma: number = 0;
  private isPreviewMode: boolean = false;
  private turntableAngle: number = 0;

  // Beat pulse animation state
  private beatPulse: number = 0;

  constructor(container: HTMLElement, customization: PlayerCustomization) {
    this.container = container;
    this.currentCustomization = customization;

    // Detect software WebGL
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 2. Scene & Fog Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05050c);
    this.scene.fog = new THREE.FogExp2(0x05050c, 0.016);

    // 3. Camera Setup
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      250
    );
    this.camera.position.set(0, 4, 8);

    // 4. Procedural Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch {
      // Fallback gracefully
    }

    // 5. Lighting Rig
    this.dirLight = new THREE.DirectionalLight(0xfff5e6, 2.0); // Warm key light
    this.dirLight.position.set(15, 25, 15);
    if (!this.isSoftwareGl) {
      this.dirLight.castShadow = true;
      this.dirLight.shadow.mapSize.width = 1024;
      this.dirLight.shadow.mapSize.height = 1024;
      this.dirLight.shadow.bias = -0.0005;
      this.dirLight.shadow.normalBias = 0.02;
      this.dirLight.shadow.camera.near = 1;
      this.dirLight.shadow.camera.far = 70;
      this.dirLight.shadow.camera.left = -20;
      this.dirLight.shadow.camera.right = 20;
      this.dirLight.shadow.camera.top = 20;
      this.dirLight.shadow.camera.bottom = -20;
    }
    this.scene.add(this.dirLight);

    this.hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 1.2); // Cool sky / warm ground
    this.scene.add(this.hemiLight);

    // 6. Object Groups
    this.trackGroup = new THREE.Group();
    this.bgGroup = new THREE.Group();
    this.particlesGroup = new THREE.Group();
    this.scene.add(this.bgGroup, this.trackGroup, this.particlesGroup);

    this.initBackgroundCity();
    this.initParticlePool();
    this.rebuildPlayer(this.currentMode);

    // Handle resize
    window.addEventListener('resize', this.onWindowResize);
  }

  public setViewMode(mode: CameraViewMode) {
    this.viewMode = mode;
  }

  public setPreviewMode(enabled: boolean) {
    this.isPreviewMode = enabled;
  }

  public triggerBeatPulse() {
    this.beatPulse = 1.0;
  }

  public triggerCameraShake(intensity = 0.5) {
    this.cameraTrauma = Math.min(1.0, this.cameraTrauma + intensity);
  }

  // --- Background Scenery ---
  private initBackgroundCity() {
    // Floating cyberpunk towers and geometric monoliths in the far distance
    const towerGeo = new THREE.BoxGeometry(6, 40, 6);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a18,
      roughness: 0.8,
      metalness: 0.3,
    });

    for (let i = 0; i < 35; i++) {
      const tower = new THREE.Mesh(towerGeo, towerMat);
      const x = (i - 5) * 16 + (Math.random() - 0.5) * 8;
      const z = -25 - Math.random() * 30;
      const y = -10 + (Math.random() - 0.5) * 8;
      tower.position.set(x, y, z);
      this.bgGroup.add(tower);

      // Neon vertical window strip
      const stripGeo = new THREE.PlaneGeometry(0.8, 30);
      const stripMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x06b6d4 : 0xec4899,
        transparent: true,
        opacity: 0.35,
      });
      const strip = new THREE.Mesh(stripGeo, stripMat);
      strip.position.set(x, y, z + 3.05);
      this.bgGroup.add(strip);
    }
  }

  // --- Particle Pool (Zero GC) ---
  private initParticlePool() {
    const count = 100;
    const pGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);

    for (let i = 0; i < count; i++) {
      const pMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      this.particlesGroup.add(mesh);
      this.particleMeshes.push(mesh);

      this.particlePool.push({
        active: false,
        x: 0,
        y: 0,
        z: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        life: 0,
        maxLife: 0.5,
        size: 0.12,
        color: new THREE.Color(0x06b6d4),
      });
    }
  }

  public emitTrail(x: number, y: number, z: number, colorHex: string, count = 2) {
    let spawned = 0;
    for (let i = 0; i < this.particlePool.length; i++) {
      const p = this.particlePool[i];
      if (!p.active) {
        p.active = true;
        p.x = x - 0.3 + (Math.random() - 0.5) * 0.15;
        p.y = y + 0.3 + (Math.random() - 0.5) * 0.15;
        p.z = z + (Math.random() - 0.5) * 0.15;
        p.vx = -4.0 - Math.random() * 2.0;
        p.vy = (Math.random() - 0.5) * 1.5;
        p.vz = (Math.random() - 0.5) * 1.5;
        p.life = 0;
        p.maxLife = 0.35 + Math.random() * 0.15;
        p.color.set(colorHex);
        p.size = 0.14;
        spawned++;
        if (spawned >= count) break;
      }
    }
  }

  public emitDeathShatter(x: number, y: number, z: number, colorHex: string) {
    this.triggerCameraShake(0.8);
    let spawned = 0;
    for (let i = 0; i < this.particlePool.length; i++) {
      const p = this.particlePool[i];
      if (!p.active) {
        p.active = true;
        p.x = x;
        p.y = y + 0.45;
        p.z = z;
        const angle = Math.random() * Math.PI * 2;
        const speed = 5.0 + Math.random() * 8.0;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed + 3.0;
        p.vz = (Math.random() - 0.5) * 8.0;
        p.life = 0;
        p.maxLife = 0.7 + Math.random() * 0.4;
        p.color.set(Math.random() > 0.4 ? colorHex : '#ffffff');
        p.size = 0.22;
        spawned++;
        if (spawned >= 40) break;
      }
    }
  }

  // --- Track & Level Setup ---
  public loadLevel(level: LevelData) {
    // Clear existing track meshes
    while (this.trackGroup.children.length > 0) {
      const obj = this.trackGroup.children[0];
      this.trackGroup.remove(obj);
    }
    this.obstacleMeshes.clear();

    const trackLen = level.trackLength + 40;
    const primaryCol = new THREE.Color(level.primaryColor);
    const floorCol = new THREE.Color(level.floorColor);

    // 1. Neon Floor Track
    const floorGeo = new THREE.BoxGeometry(trackLen, 0.4, 6.0);
    const floorMat = new THREE.MeshStandardMaterial({
      color: floorCol,
      roughness: 0.6,
      metalness: 0.4,
    });
    this.floorPlane = new THREE.Mesh(floorGeo, floorMat);
    this.floorPlane.position.set(trackLen / 2 - 10, -0.2, 0);
    this.floorPlane.receiveShadow = true;
    this.trackGroup.add(this.floorPlane);

    // 2. Glowing Side Guardrails
    const railGeo = new THREE.BoxGeometry(trackLen, 0.25, 0.25);
    const railMat = new THREE.MeshStandardMaterial({
      color: primaryCol,
      emissive: primaryCol,
      emissiveIntensity: 1.2,
    });
    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(trackLen / 2 - 10, 0.05, -3.0);
    const rightRail = new THREE.Mesh(railGeo, railMat);
    rightRail.position.set(trackLen / 2 - 10, 0.05, 3.0);
    this.trackGroup.add(leftRail, rightRail);

    // 3. Floor Grid lines
    this.floorGridMesh = new THREE.GridHelper(trackLen, Math.floor(trackLen / 2), primaryCol, 0x1e293b);
    this.floorGridMesh.position.set(trackLen / 2 - 10, 0.02, 0);
    this.trackGroup.add(this.floorGridMesh);

    // 4. Ceiling Track (for inverted gravity / ship ceiling)
    const ceilingGeo = new THREE.BoxGeometry(trackLen, 0.4, 6.0);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: floorCol,
      roughness: 0.6,
      metalness: 0.4,
    });
    this.ceilingPlane = new THREE.Mesh(ceilingGeo, ceilingMat);
    this.ceilingPlane.position.set(trackLen / 2 - 10, 10.7, 0);
    this.trackGroup.add(this.ceilingPlane);

    // 5. Spawn Level Obstacles
    level.obstacles.forEach((obs) => {
      let mesh: THREE.Group | null = null;
      if (obs.type === 'spike') {
        mesh = createSpikeMesh(false, primaryCol.getHex());
        mesh.position.set(obs.x + 0.5, obs.y, 0);
      } else if (obs.type === 'spike_ceiling') {
        mesh = createSpikeMesh(true, primaryCol.getHex());
        mesh.position.set(obs.x + 0.5, obs.y + 1, 0);
      } else if (obs.type === 'block' || obs.type === 'block_half') {
        mesh = createBlockMesh(obs.width || 1, obs.height || 1, primaryCol.getHex());
        mesh.position.set(obs.x, obs.y, 0);
      } else if (obs.type.startsWith('pad_')) {
        mesh = createPadMesh(obs.type);
        mesh.position.set(obs.x + 0.5, obs.y, 0);
      } else if (obs.type.startsWith('orb_')) {
        mesh = createOrbMesh(obs.type);
        mesh.position.set(obs.x + 0.5, obs.y + 0.5, 0);
      } else if (obs.type.startsWith('portal_')) {
        mesh = createPortalMesh(obs.type);
        mesh.position.set(obs.x + 0.5, obs.y, 0);
        if (obs.type === 'portal_teleport') {
          const exitMesh = createPortalMesh('portal_teleport', 0xfb923c);
          exitMesh.scale.set(0.85, 0.85, 0.85);
          exitMesh.position.set((obs.targetX ?? obs.x + 1.5) + 0.5, (obs.targetY ?? 5.5) - 0.8, 0);
          this.trackGroup.add(exitMesh);
        }
      } else if (obs.type === 'coin') {
        mesh = createCoinMesh();
        mesh.position.set(obs.x + 0.5, obs.y + 0.5, 0);
      }

      if (mesh) {
        this.trackGroup.add(mesh);
        this.obstacleMeshes.set(obs.id, mesh);
      }
    });

    // 6. Finish Line Arch at level.trackLength
    const finishArch = createPortalMesh('portal_speed_3x');
    finishArch.position.set(level.trackLength, 0, 0);
    this.trackGroup.add(finishArch);
  }

  // --- Player Mesh Management ---
  public rebuildPlayer(mode: GameMode, cust?: PlayerCustomization) {
    if (cust) this.currentCustomization = cust;
    this.currentMode = mode;

    if (this.playerGroup) {
      this.scene.remove(this.playerGroup);
    }
    this.playerGroup = createPlayerMesh(mode, this.currentCustomization);
    this.scene.add(this.playerGroup);
  }

  public hideCollectedCoin(coinId: number) {
    const mesh = this.obstacleMeshes.get(coinId);
    if (mesh) {
      mesh.visible = false;
    }
  }

  // --- Render & Animation Loop ---
  public renderFrame(
    playerPhysics: PlayerPhysicsState | null,
    delta: number,
    levelLength: number = 300
  ) {
    const dt = Math.min(delta, 0.05);

    // Update beat pulse decay
    this.beatPulse = Math.max(0, this.beatPulse - dt * 3.5);
    // Pulse light and background grid with beat
    this.dirLight.intensity = 2.0 + this.beatPulse * 0.8;
    this.hemiLight.intensity = 1.2 + this.beatPulse * 0.5;

    // Decay camera shake
    this.cameraTrauma = Math.max(0, this.cameraTrauma - dt * 2.2);
    const shakeAmount = this.cameraTrauma * this.cameraTrauma * 0.45;
    const shakeX = (Math.random() - 0.5) * shakeAmount;
    const shakeY = (Math.random() - 0.5) * shakeAmount;

    // 1. Update Obstacle Dynamic Rotations (Orbs, Portals, Coins)
    this.obstacleMeshes.forEach((mesh) => {
      const ring = mesh.getObjectByName('orbRing');
      if (ring) {
        ring.rotation.x += 2.0 * dt;
        ring.rotation.y += 2.8 * dt;
      }
      const core = mesh.getObjectByName('orbCore');
      if (core) {
        core.rotation.y += 3.5 * dt;
      }
      const vortex = mesh.getObjectByName('portalVortex');
      if (vortex) {
        vortex.rotation.z += 4.0 * dt;
      }
      // If mesh is coin, spin it
      if (mesh.children.length === 3 && mesh.children[0].type === 'Mesh') {
        mesh.rotation.y += 3.0 * dt;
      }
    });

    // 2. Update Particles
    for (let i = 0; i < this.particlePool.length; i++) {
      const p = this.particlePool[i];
      const m = this.particleMeshes[i];

      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
          m.visible = false;
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.z += p.vz * dt;
          p.vy -= 18.0 * dt; // gravity on particles

          m.position.set(p.x, p.y, p.z);
          const progress = p.life / p.maxLife;
          const scale = p.size * (1 - progress);
          m.scale.set(scale, scale, scale);

          const mat = m.material as THREE.MeshBasicMaterial;
          mat.color.copy(p.color);
          mat.opacity = 1 - progress;
          m.visible = true;
        }
      } else {
        m.visible = false;
      }
    }

    // 3. Customizer Turntable Preview Mode
    if (this.isPreviewMode) {
      this.turntableAngle += dt * 0.9;
      if (this.playerGroup) {
        this.playerGroup.position.set(0, 0, 0);
        this.playerGroup.rotation.set(0, this.turntableAngle, 0);
      }
      this.camera.position.set(
        Math.sin(this.turntableAngle) * 3.5,
        1.8,
        Math.cos(this.turntableAngle) * 3.5
      );
      this.camera.lookAt(0, 0.45, 0);
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // 4. In-Game Player & Camera Simulation
    if (playerPhysics && this.playerGroup) {
      // Rebuild player mesh if game mode changed
      if (playerPhysics.mode !== this.currentMode) {
        this.rebuildPlayer(playerPhysics.mode);
      }

      // Sync player group position
      this.playerGroup.position.set(playerPhysics.x, playerPhysics.y, 0);

      // Mini mode + inverted gravity visual scale
      const pScale = playerPhysics.isMini ? 0.6 : 1.0;
      this.playerGroup.scale.set(
        pScale,
        pScale * (playerPhysics.gravityDir === -1 ? -1 : 1),
        pScale
      );

      // Mode-specific rotations
      if (
        playerPhysics.mode === 'cube' ||
        playerPhysics.mode === 'ship' ||
        playerPhysics.mode === 'wave' ||
        playerPhysics.mode === 'ball' ||
        playerPhysics.mode === 'ufo'
      ) {
        this.playerGroup.rotation.z = playerPhysics.rotationZ;
        this.playerGroup.rotation.x = 0;
      }

      // Hide player if dead
      this.playerGroup.visible = !playerPhysics.isDead;

      // Emit continuous player trail
      if (!playerPhysics.isDead) {
        this.emitTrail(playerPhysics.x, playerPhysics.y, 0, this.currentCustomization.primaryColor, 1);
      }

      // Dynamic Directional Light follows player
      this.dirLight.position.set(playerPhysics.x + 12, 22, 14);
      this.dirLight.target.position.set(playerPhysics.x + 5, 0, 0);
      this.dirLight.target.updateMatrixWorld();

      // Camera Rig calculation based on viewMode
      const targetLookX = playerPhysics.x + 4.5;
      const targetLookY = Math.max(1.8, playerPhysics.y * 0.4 + 1.8);

      switch (this.viewMode) {
        case 'chase':
          // 3D dynamic chase cam behind and slightly elevated
          _targetCam.set(playerPhysics.x - 5.5, playerPhysics.y * 0.35 + 3.4, 4.8);
          break;
        case 'iso':
          // Isometric 3D angle
          _targetCam.set(playerPhysics.x - 3.0, 7.5, 9.5);
          break;
        case 'classic':
          // 2.5D side profile
          _targetCam.set(playerPhysics.x - 1.0, playerPhysics.y * 0.4 + 3.0, 8.5);
          break;
      }

      // Exponential damping for silky-smooth glide
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, _targetCam.x + shakeX, 8.0, dt);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, _targetCam.y + shakeY, 8.0, dt);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, _targetCam.z, 8.0, dt);

      _camLook.set(targetLookX, targetLookY, 0);
      this.camera.lookAt(_camLook);
    }

    this.renderer.render(this.scene, this.camera);
  }

  private onWindowResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  };

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize);
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
