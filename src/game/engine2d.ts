import { GameMode, LevelData, LevelObstacle, ObstacleType, PlayerCustomization } from '../types';
import { PlayerPhysicsState } from './physics';

export interface Particle2D {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  life: number;
  maxLife: number;
  color: string;
  shape: 'square' | 'triangle' | 'circle';
}

export class Engine2D {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private currentCustomization: PlayerCustomization;
  private currentLevel: LevelData | null = null;

  // Camera & Viewport
  private cameraX: number = 0;
  private cameraY: number = 0;
  private unitSize: number = 52; // 1 physics unit = 52 pixels
  private floorBaseY: number = 0; // pixel Y coordinate of floor
  private cameraShake: number = 0;

  // Beat & Visual Effects
  private beatPulse: number = 0;
  private waveTrail: Array<{ x: number; y: number }> = [];
  private particles: Particle2D[] = [];
  private bgScrollOffset: number = 0;

  constructor(canvas: HTMLCanvasElement, customization: PlayerCustomization) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get 2D canvas context');
    this.ctx = context;
    this.currentCustomization = customization;

    this.initParticles();
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (!this.canvas || !this.canvas.parentElement) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    // Floor is around 75% down the screen, leaving room for track and ceiling
    this.floorBaseY = this.canvas.height * 0.76;
    // Scale unit size slightly on smaller screens
    this.unitSize = Math.max(40, Math.min(56, this.canvas.height / 14));
  };

  private initParticles() {
    this.particles = [];
    for (let i = 0; i < 120; i++) {
      this.particles.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 8,
        rotation: 0,
        vRot: 0,
        life: 0,
        maxLife: 0.6,
        color: '#22c55e',
        shape: 'square',
      });
    }
  }

  public setCustomization(cust: PlayerCustomization) {
    this.currentCustomization = cust;
  }

  public loadLevel(level: LevelData) {
    this.currentLevel = level;
    this.waveTrail = [];
    this.cameraX = 0;
    this.cameraY = 0;
  }

  public triggerBeatPulse() {
    this.beatPulse = 1.0;
  }

  public triggerShake(intensity = 0.5) {
    this.cameraShake = Math.min(1.0, this.cameraShake + intensity);
  }

  public emitTrail(x: number, y: number, color: string) {
    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.x = x * this.unitSize + (Math.random() - 0.5) * 8;
        p.y = this.worldToScreenY(y) + (Math.random() - 0.5) * 8;
        p.vx = -120 - Math.random() * 80;
        p.vy = (Math.random() - 0.5) * 60;
        p.size = 7 + Math.random() * 4;
        p.rotation = Math.random() * Math.PI * 2;
        p.vRot = (Math.random() - 0.5) * 8;
        p.life = 0;
        p.maxLife = 0.35 + Math.random() * 0.15;
        p.color = color;
        p.shape = 'square';
        spawned++;
        if (spawned >= 2) break;
      }
    }
  }

  public emitDeathShatter(x: number, y: number, color: string) {
    this.triggerShake(0.8);
    const px = x * this.unitSize;
    const py = this.worldToScreenY(y);

    let spawned = 0;
    for (const p of this.particles) {
      if (!p.active) {
        p.active = true;
        p.x = px;
        p.y = py;
        const angle = Math.random() * Math.PI * 2;
        const speed = 180 + Math.random() * 320;
        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed - 100;
        p.size = 10 + Math.random() * 8;
        p.rotation = Math.random() * Math.PI * 2;
        p.vRot = (Math.random() - 0.5) * 15;
        p.life = 0;
        p.maxLife = 0.8 + Math.random() * 0.4;
        p.color = Math.random() > 0.4 ? color : '#ffffff';
        p.shape = Math.random() > 0.5 ? 'triangle' : 'square';
        spawned++;
        if (spawned >= 45) break;
      }
    }
  }

  private worldToScreenX(worldX: number): number {
    return (worldX - this.cameraX) * this.unitSize + this.canvas.width * 0.22;
  }

  private worldToScreenY(worldY: number): number {
    return this.floorBaseY - worldY * this.unitSize - this.cameraY * this.unitSize;
  }

  public renderFrame(
    player: PlayerPhysicsState | null,
    delta: number,
    level: LevelData,
    isPreview = false
  ) {
    const dt = Math.min(delta, 0.05);
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Decay beat pulse & camera shake
    this.beatPulse = Math.max(0, this.beatPulse - dt * 3.2);
    this.cameraShake = Math.max(0, this.cameraShake - dt * 2.5);

    const shakeX = (Math.random() - 0.5) * this.cameraShake * this.cameraShake * 16;
    const shakeY = (Math.random() - 0.5) * this.cameraShake * this.cameraShake * 16;

    // Camera follow player
    if (player && !isPreview) {
      this.cameraX = player.x;
      // Soft vertical damping
      const targetCamY = Math.max(0, (player.y - 4.5) * 0.5);
      this.cameraY += (targetCamY - this.cameraY) * Math.min(1, dt * 6);
    }

    ctx.save();
    ctx.translate(shakeX, shakeY);

    // 1. DYNAMIC PULSING BACKGROUND
    this.renderBackground(W, H, level, dt);

    // 2. PARALLAX GEOMETRIC PATTERNS IN BACKGROUND
    this.renderBackgroundParallax(W, H, level);

    // 3. TRACK OBSTACLES (Blocks, Spikes, Pads, Orbs, Portals, Coins)
    this.renderObstacles(level);

    // 4. CHECKERED SCROLLING FLOOR & CEILING
    this.renderFloorAndCeiling(W, H, level);

    // 5. WAVE TRAIL
    if (player && player.mode === 'wave' && !player.isDead) {
      const waveScale = player.isMini ? 0.6 : 1.0;
      const halfUnit = 0.5 * waveScale;
      this.waveTrail.push({ x: player.x + halfUnit, y: player.y + halfUnit });
      if (this.waveTrail.length > 50) this.waveTrail.shift();
      this.renderWaveTrail();
    } else {
      this.waveTrail = [];
    }

    // 6. PARTICLES
    this.updateAndRenderParticles(dt);

    // 7. PLAYER CHARACTER
    if (player && !player.isDead) {
      this.renderPlayer(player, dt);
      const pScale = player.isMini ? 0.6 : 1.0;
      this.emitTrail(player.x + 0.1 * pScale, player.y + 0.35 * pScale, this.currentCustomization.primaryColor);
    }

    ctx.restore();
  }

  // --- Background Rendering ---
  private renderBackground(W: number, H: number, level: LevelData, dt: number) {
    const ctx = this.ctx;

    // Base gradient with beat pulse brightness
    const pulseFactor = this.beatPulse * 0.18;
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);

    // Dynamic tint shift on beat
    bgGrad.addColorStop(0, level.bgGradient[0]);
    bgGrad.addColorStop(1, level.bgGradient[1]);

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Beat pulse overlay
    if (this.beatPulse > 0.05) {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.beatPulse * 0.1})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  private renderBackgroundParallax(W: number, H: number, level: LevelData) {
    const ctx = this.ctx;
    const parallaxX = this.cameraX * this.unitSize * 0.2;

    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 2;

    // Large geometric diamond / chevron background grid (iconic Geometry Dash style)
    const gridSize = 160;
    const startX = -(parallaxX % gridSize);

    for (let x = startX - gridSize; x < W + gridSize; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + gridSize, H);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x + gridSize, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- Floor & Ceiling ---
  private renderFloorAndCeiling(W: number, H: number, level: LevelData) {
    const ctx = this.ctx;
    const floorY = this.worldToScreenY(0);
    const ceilingY = this.worldToScreenY(10.5);

    // 1. FLOOR (Checkered scrolling pattern)
    ctx.fillStyle = level.floorColor;
    ctx.fillRect(0, floorY, W, H - floorY + 100);

    // Scrolling checkers on floor
    const squareSize = 36;
    const scrollOffset = (this.cameraX * this.unitSize) % (squareSize * 2);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let x = -squareSize * 2 - scrollOffset; x < W + squareSize * 2; x += squareSize * 2) {
      for (let y = floorY; y < H; y += squareSize * 2) {
        ctx.fillRect(x, y, squareSize, squareSize);
        ctx.fillRect(x + squareSize, y + squareSize, squareSize, squareSize);
      }
    }

    // Glowing Neon Top Line of Floor
    ctx.strokeStyle = level.primaryColor;
    ctx.lineWidth = 4;
    ctx.shadowColor = level.primaryColor;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(W, floorY);
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 2. CEILING (Top boundary)
    ctx.fillStyle = level.floorColor;
    ctx.fillRect(0, 0, W, Math.max(0, ceilingY));

    ctx.strokeStyle = level.primaryColor;
    ctx.lineWidth = 3;
    ctx.shadowColor = level.primaryColor;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.moveTo(0, ceilingY);
    ctx.lineTo(W, ceilingY);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  // --- Obstacle Rendering ---
  private renderObstacles(level: LevelData) {
    const ctx = this.ctx;

    for (const obs of level.obstacles) {
      const sx = this.worldToScreenX(obs.x);
      const sy = this.worldToScreenY(obs.y);
      const sw = (obs.width || 1) * this.unitSize;
      const sh = (obs.height || 1) * this.unitSize;

      // Cull off-screen obstacles
      if (sx + sw < -50 || sx > this.canvas.width + 50) continue;

      switch (obs.type) {
        // --- 1. CLASSIC 2D SPIKE ---
        case 'spike': {
          ctx.save();
          // Shadow/Base plate
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(sx, sy - 4, sw, 4);

          // Sharp Triangle
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + sw / 2, sy - sh);
          ctx.lineTo(sx + sw, sy);
          ctx.closePath();

          ctx.fillStyle = '#1e293b';
          ctx.fill();

          // Neon Border
          ctx.strokeStyle = level.primaryColor;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = level.primaryColor;
          ctx.shadowBlur = 8;
          ctx.stroke();

          // Inner shaded half (classic GD look)
          ctx.beginPath();
          ctx.moveTo(sx + sw / 2, sy - sh);
          ctx.lineTo(sx + sw, sy);
          ctx.lineTo(sx + sw / 2, sy);
          ctx.closePath();
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.fill();

          ctx.restore();
          break;
        }

        // --- 2. CEILING SPIKE ---
        case 'spike_ceiling': {
          ctx.save();
          const topY = sy - sh;
          ctx.beginPath();
          ctx.moveTo(sx, topY);
          ctx.lineTo(sx + sw / 2, topY + sh);
          ctx.lineTo(sx + sw, topY);
          ctx.closePath();

          ctx.fillStyle = '#1e293b';
          ctx.fill();

          ctx.strokeStyle = level.primaryColor;
          ctx.lineWidth = 2.5;
          ctx.shadowColor = level.primaryColor;
          ctx.shadowBlur = 8;
          ctx.stroke();

          ctx.restore();
          break;
        }

        // --- 3. CLASSIC BLOCKS ---
        case 'block':
        case 'block_half':
        case 'block_step': {
          ctx.save();
          const bY = sy - sh;

          // Block Fill
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(sx, bY, sw, sh);

          // Neon Outer Border
          ctx.strokeStyle = level.primaryColor;
          ctx.lineWidth = 2.5;
          ctx.strokeRect(sx, bY, sw, sh);

          // Inset Square Decor
          const inset = 8;
          if (sw > inset * 2 && sh > inset * 2) {
            ctx.fillStyle = level.secondaryColor + '33';
            ctx.fillRect(sx + inset, bY + inset, sw - inset * 2, sh - inset * 2);
            ctx.strokeStyle = level.secondaryColor + '88';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(sx + inset, bY + inset, sw - inset * 2, sh - inset * 2);
          }

          ctx.restore();
          break;
        }

        // --- 4. JUMP PADS ---
        case 'pad_yellow':
        case 'pad_pink':
        case 'pad_blue': {
          ctx.save();
          let padColor = '#eab308'; // Yellow
          if (obs.type === 'pad_pink') padColor = '#ec4899';
          if (obs.type === 'pad_blue') padColor = '#06b6d4';

          const padH = 14;
          const padY = sy - padH;

          // Pad Base
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(sx + 4, padY + 6, sw - 8, 8);

          // Glowing Spring Plate
          ctx.fillStyle = padColor;
          ctx.shadowColor = padColor;
          ctx.shadowBlur = 10;
          ctx.fillRect(sx + 6, padY, sw - 12, 6);

          // Upward Arrow Chevron
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(sx + sw / 2, padY - 6);
          ctx.lineTo(sx + sw / 2 - 8, padY);
          ctx.lineTo(sx + sw / 2 + 8, padY);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
          break;
        }

        // --- 5. JUMP ORBS ---
        case 'orb_yellow':
        case 'orb_pink':
        case 'orb_blue':
        case 'orb_black': {
          ctx.save();
          let orbColor = '#eab308';
          if (obs.type === 'orb_pink') orbColor = '#ec4899';
          if (obs.type === 'orb_blue') orbColor = '#06b6d4';
          if (obs.type === 'orb_black') orbColor = '#18181b';

          const cx = sx + sw / 2;
          const cy = sy - sh / 2;
          const radius = (sw / 2) * 0.75;

          // Outer Pulsing Ring
          ctx.strokeStyle = orbColor;
          ctx.lineWidth = 3;
          ctx.shadowColor = orbColor;
          ctx.shadowBlur = 12 + this.beatPulse * 8;
          ctx.beginPath();
          ctx.arc(cx, cy, radius + 4, 0, Math.PI * 2);
          ctx.stroke();

          // Inner Crystal Core
          ctx.fillStyle = orbColor;
          ctx.beginPath();
          ctx.arc(cx, cy, radius * 0.65, 0, Math.PI * 2);
          ctx.fill();

          // Inner white specular glint
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx - 3, cy - 3, radius * 0.25, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
          break;
        }

        // --- 6. PORTALS ---
        case 'portal_cube':
        case 'portal_ship':
        case 'portal_wave':
        case 'portal_ball':
        case 'portal_ufo':
        case 'portal_gravity_up':
        case 'portal_gravity_down':
        case 'portal_speed_1x':
        case 'portal_speed_2x':
        case 'portal_speed_3x':
        case 'portal_mini':
        case 'portal_normal':
        case 'portal_teleport': {
          ctx.save();
          let pColor = '#22c55e'; // Cube green
          let portalLabel = '';
          if (obs.type === 'portal_ship') pColor = '#ec4899'; // Ship pink
          else if (obs.type === 'portal_wave') pColor = '#06b6d4'; // Wave cyan
          else if (obs.type === 'portal_ball') pColor = '#f97316'; // Ball orange
          else if (obs.type === 'portal_ufo') pColor = '#a855f7'; // UFO purple
          else if (obs.type === 'portal_gravity_up') {
            pColor = '#3b82f6';
            portalLabel = '↑';
          } else if (obs.type === 'portal_gravity_down') {
            pColor = '#eab308';
            portalLabel = '↓';
          } else if (obs.type === 'portal_speed_1x') {
            pColor = '#38bdf8';
            portalLabel = '>';
          } else if (obs.type === 'portal_speed_2x') {
            pColor = '#facc15';
            portalLabel = '>>';
          } else if (obs.type === 'portal_speed_3x') {
            pColor = '#f97316';
            portalLabel = '>>>';
          } else if (obs.type === 'portal_mini') {
            pColor = '#d946ef';
            portalLabel = 'MINI';
          } else if (obs.type === 'portal_normal') {
            pColor = '#4ade80';
            portalLabel = 'MAX';
          } else if (obs.type === 'portal_teleport') {
            pColor = '#06b6d4';
            portalLabel = 'TP';
          }

          const cx = sx + sw / 2;
          const cy = this.worldToScreenY(obs.y + 1.85);
          const radX = Math.max(11, Math.round(this.unitSize * 0.25));
          const radY = this.unitSize * 1.65;

          // Teleport Exit Portal & Energy Beam
          if (obs.type === 'portal_teleport') {
            const targetWorldX = obs.targetX ?? obs.x + 1.5;
            const targetWorldY = obs.targetY ?? 5.5;
            const tx = this.worldToScreenX(targetWorldX + 0.5);
            const ty = this.worldToScreenY(targetWorldY + 0.5);

            // Connecting energy beam
            ctx.save();
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.55)';
            ctx.lineWidth = 2.5;
            ctx.setLineDash([6, 6]);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.restore();

            // Orange Exit Portal Ring
            ctx.save();
            const exitRadX = Math.max(10, Math.round(this.unitSize * 0.22));
            const exitRadY = this.unitSize * 1.15;
            ctx.strokeStyle = '#fb923c';
            ctx.lineWidth = 3.5;
            ctx.shadowColor = '#fb923c';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.ellipse(tx, ty, exitRadX, exitRadY, 0, 0, Math.PI * 2);
            ctx.stroke();

            ctx.fillStyle = 'rgba(251, 146, 60, 0.28)';
            ctx.beginPath();
            ctx.ellipse(tx, ty, exitRadX * 0.75, exitRadY * 0.85, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('OUT', tx, ty);
            ctx.restore();
          }

          // Outer Portal Gateway Arch
          ctx.strokeStyle = pColor;
          ctx.lineWidth = 3.5;
          ctx.shadowColor = pColor;
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.ellipse(cx, cy, radX, radY, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Swirling Vortex Core
          ctx.fillStyle = pColor + '44';
          ctx.beginPath();
          ctx.ellipse(cx, cy, radX * 0.78, radY * 0.88, 0, 0, Math.PI * 2);
          ctx.fill();

          if (portalLabel) {
            ctx.shadowBlur = 0;
            ctx.fillStyle = '#ffffff';
            ctx.font = portalLabel.length >= 3 ? 'bold 9px monospace' : 'bold 13px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(portalLabel, cx, cy);
          }

          ctx.restore();
          break;
        }

        // --- 7. SECRET GOLD COINS ---
        case 'coin': {
          if (obs.collected) break;
          ctx.save();
          const cx = sx + sw / 2;
          const cy = sy - sh / 2;
          const radius = 18;

          // Outer Gold Rim
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 14;
          ctx.beginPath();
          ctx.arc(cx, cy, radius, 0, Math.PI * 2);
          ctx.fill();

          // Inner Star Crest
          ctx.fillStyle = '#fef08a';
          ctx.font = 'bold 16px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', cx, cy + 1);

          ctx.restore();
          break;
        }
      }
    }
  }

  // --- Wave Trail (Solid line behind player) ---
  private renderWaveTrail() {
    if (this.waveTrail.length < 2) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = this.currentCustomization.primaryColor;
    ctx.lineWidth = 5;
    ctx.shadowColor = this.currentCustomization.primaryColor;
    ctx.shadowBlur = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    const first = this.waveTrail[0];
    ctx.moveTo(this.worldToScreenX(first.x), this.worldToScreenY(first.y));
    for (let i = 1; i < this.waveTrail.length; i++) {
      const pt = this.waveTrail[i];
      ctx.lineTo(this.worldToScreenX(pt.x), this.worldToScreenY(pt.y));
    }
    ctx.stroke();
    ctx.restore();
  }

  // --- Particles ---
  private updateAndRenderParticles(dt: number) {
    const ctx = this.ctx;
    for (const p of this.particles) {
      if (p.active) {
        p.life += dt;
        if (p.life >= p.maxLife) {
          p.active = false;
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 380 * dt; // gravity
          p.rotation += p.vRot * dt;

          const progress = p.life / p.maxLife;
          const alpha = 1 - progress;
          const size = p.size * (1 - progress * 0.5);

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = alpha;

          if (p.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -size / 2);
            ctx.lineTo(-size / 2, size / 2);
            ctx.lineTo(size / 2, size / 2);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.fillRect(-size / 2, -size / 2, size, size);
          }

          ctx.restore();
        }
      }
    }
  }

  // --- Player Character 2D ---
  private renderPlayer(player: PlayerPhysicsState, dt: number) {
    const ctx = this.ctx;
    const playerScale = player.isMini ? 0.6 : 1.0;
    const px = this.worldToScreenX(player.x + 0.5 * playerScale);
    const py = this.worldToScreenY(player.y + 0.5 * playerScale);
    const size = this.unitSize * 0.95 * playerScale;

    ctx.save();
    ctx.translate(px, py);

    // Gravity Invert
    if (player.gravityDir === -1) {
      ctx.scale(1, -1);
    }

    // Rotations based on mode
    ctx.rotate(player.rotationZ);

    const half = size / 2;
    const cust = this.currentCustomization;

    switch (player.mode) {
      // 1. CLASSIC CUBE
      case 'cube': {
        // Outer Cube Body
        ctx.fillStyle = cust.primaryColor;
        ctx.fillRect(-half, -half, size, size);

        // Thick Black Border (iconic Geometry Dash style)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.strokeRect(-half, -half, size, size);

        // Inner Face Recess Panel
        const faceInset = size * 0.16;
        const faceSize = size - faceInset * 2;
        ctx.fillStyle = cust.secondaryColor;
        ctx.fillRect(-half + faceInset, -half + faceInset, faceSize, faceSize);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-half + faceInset, -half + faceInset, faceSize, faceSize);

        // Eyes (Left & Right)
        ctx.fillStyle = cust.glowColor;
        const eyeSize = size * 0.18;
        ctx.fillRect(-half + faceInset + size * 0.1, -half + faceInset + size * 0.12, eyeSize, eyeSize);
        ctx.fillRect(half - faceInset - size * 0.28, -half + faceInset + size * 0.12, eyeSize, eyeSize);

        // Mouth / Smile
        ctx.fillRect(-size * 0.22, half - faceInset - size * 0.22, size * 0.44, size * 0.12);
        break;
      }

      // 2. SHIP MODE
      case 'ship': {
        // Fuselage Body
        ctx.fillStyle = cust.primaryColor;
        ctx.beginPath();
        ctx.moveTo(half + 4, 0);
        ctx.lineTo(-half, -half * 0.7);
        ctx.lineTo(-half * 0.5, 0);
        ctx.lineTo(-half, half * 0.7);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Cockpit Canopy
        ctx.fillStyle = cust.glowColor;
        ctx.beginPath();
        ctx.ellipse(0, -2, size * 0.22, size * 0.16, 0, 0, Math.PI * 2);
        ctx.fill();

        // Animated Thruster Fire
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(-half * 0.6, -size * 0.15);
        ctx.lineTo(-half - 12 - Math.random() * 8, 0);
        ctx.lineTo(-half * 0.6, size * 0.15);
        ctx.closePath();
        ctx.fill();
        break;
      }

      // 3. WAVE MODE (Triangle Dart)
      case 'wave': {
        ctx.fillStyle = cust.primaryColor;
        ctx.beginPath();
        ctx.moveTo(half + 6, 0);
        ctx.lineTo(-half, -half * 0.85);
        ctx.lineTo(-half * 0.4, 0);
        ctx.lineTo(-half, half * 0.85);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Inner Energy Spine
        ctx.fillStyle = cust.secondaryColor;
        ctx.beginPath();
        ctx.moveTo(half * 0.4, 0);
        ctx.lineTo(-half * 0.4, -half * 0.35);
        ctx.lineTo(-half * 0.4, half * 0.35);
        ctx.closePath();
        ctx.fill();
        break;
      }

      // 4. BALL MODE
      case 'ball': {
        // Outer gear circle
        ctx.fillStyle = cust.primaryColor;
        ctx.beginPath();
        ctx.arc(0, 0, half, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Crossed Spokes
        ctx.strokeStyle = cust.secondaryColor;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-half * 0.7, -half * 0.7);
        ctx.lineTo(half * 0.7, half * 0.7);
        ctx.moveTo(-half * 0.7, half * 0.7);
        ctx.lineTo(half * 0.7, -half * 0.7);
        ctx.stroke();

        // Center hub
        ctx.fillStyle = cust.glowColor;
        ctx.beginPath();
        ctx.arc(0, 0, half * 0.35, 0, Math.PI * 2);
        ctx.fill();
        break;
      }

      // 5. UFO MODE
      case 'ufo': {
        // Saucer rim
        ctx.fillStyle = cust.primaryColor;
        ctx.beginPath();
        ctx.ellipse(0, 4, half + 4, half * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Glass Dome
        ctx.fillStyle = cust.glowColor + 'cc';
        ctx.beginPath();
        ctx.arc(0, 0, half * 0.55, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        break;
      }
    }

    ctx.restore();
  }

  public dispose() {
    window.removeEventListener('resize', this.handleResize);
  }
}
