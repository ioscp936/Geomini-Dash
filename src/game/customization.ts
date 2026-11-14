import { PlayerCustomization } from '../types';

export interface SkinOption {
  id: string;
  name: string;
  vietnameseName: string;
  iconName: string;
}

export const CUBE_SKINS: SkinOption[] = [
  { id: 'classic', name: 'Classic Icon', vietnameseName: 'Biểu Tượng Cổ Điển', iconName: 'Square' },
  { id: 'ninja', name: 'Cyber Ninja', vietnameseName: 'Ninja Điện Tử', iconName: 'Eye' },
  { id: 'robo', name: 'Robo Visor', vietnameseName: 'Kính Robot Neon', iconName: 'Glasses' },
  { id: 'demon', name: 'Fire Demon', vietnameseName: 'Quỷ Lửa Địa Ngục', iconName: 'Flame' },
  { id: 'star', name: 'Cosmic Star', vietnameseName: 'Ngôi Sao Vũ Trụ', iconName: 'Star' },
  { id: 'skull', name: 'Skull King', vietnameseName: 'Vua Đầu Lâu', iconName: 'Crown' },
  { id: 'pixel', name: 'Pixel Retro', vietnameseName: 'Điểm Ảnh Retro', iconName: 'Grid' },
  { id: 'mecha', name: 'Mecha Core', vietnameseName: 'Lõi Titan Mecha', iconName: 'Cpu' },
];

export const SHIP_SKINS: SkinOption[] = [
  { id: 'classic_dart', name: 'Dart Cruiser', vietnameseName: 'Phi Thuyền Mũi Tên', iconName: 'Rocket' },
  { id: 'stealth_wing', name: 'Stealth Wing', vietnameseName: 'Cánh Tàng Hình', iconName: 'Plane' },
  { id: 'cyber_cruiser', name: 'Cyber Cruiser', vietnameseName: 'Tuần Dương Không Gian', iconName: 'Crosshair' },
  { id: 'plasma_jet', name: 'Plasma Jet', vietnameseName: 'Phản Lực Plasma', iconName: 'Zap' },
];

export const WAVE_SKINS: SkinOption[] = [
  { id: 'arrow', name: 'Pulse Arrow', vietnameseName: 'Mũi Tên Năng Lượng', iconName: 'Navigation' },
  { id: 'shuriken', name: 'Cyber Shuriken', vietnameseName: 'Phi Tiêu Lôi Điện', iconName: 'Compass' },
  { id: 'laser_needle', name: 'Laser Needle', vietnameseName: 'Kim Nhọn Laser', iconName: 'PenTool' },
  { id: 'spike_dart', name: 'Spike Dart', vietnameseName: 'Phi Tiêu Gai Plasma', iconName: 'ChevronRight' },
];

export const BALL_SKINS: SkinOption[] = [
  { id: 'techno_wheel', name: 'Techno Wheel', vietnameseName: 'Bánh Xe Kỹ Thuật', iconName: 'Disc' },
  { id: 'sawblade', name: 'Sawblade', vietnameseName: 'Lưỡi Cưa Xoay', iconName: 'Sun' },
  { id: 'yin_yang', name: 'Yin Yang', vietnameseName: 'Âm Dương Luân Hồi', iconName: 'CircleDot' },
  { id: 'atomic', name: 'Atomic Core', vietnameseName: 'Lõi Nguyên Tử', iconName: 'Radio' },
];

export const UFO_SKINS: SkinOption[] = [
  { id: 'classic_saucer', name: 'Saucer Dome', vietnameseName: 'Đĩa Bay Cổ Điển', iconName: 'Disc' },
  { id: 'alien_pod', name: 'Alien Pod', vietnameseName: 'Phi Thuyền Người Ngoài Hành Tinh', iconName: 'Radio' },
  { id: 'cyber_hopper', name: 'Cyber Hopper', vietnameseName: 'Máy Bay Nhảy Điện Tử', iconName: 'Zap' },
];

export const COLOR_PALETTE = [
  { id: '#22c55e', name: 'Neon Green', vietnamese: 'Xanh Lá Neon' },
  { id: '#06b6d4', name: 'Cyber Cyan', vietnamese: 'Xanh Lơ Điện Tử' },
  { id: '#3b82f6', name: 'Electric Blue', vietnamese: 'Xanh Biển Điện' },
  { id: '#a855f7', name: 'Plasma Purple', vietnamese: 'Tím Plasma' },
  { id: '#ec4899', name: 'Hot Pink', vietnamese: 'Hồng Rực Rỡ' },
  { id: '#eab308', name: 'Hyper Yellow', vietnamese: 'Vàng Rực' },
  { id: '#f97316', name: 'Blaze Orange', vietnamese: 'Cam Rực Lửa' },
  { id: '#ef4444', name: 'Crimson Red', vietnamese: 'Đỏ Thẫm' },
  { id: '#ffffff', name: 'Pure White', vietnamese: 'Trắng Tinh Khiết' },
  { id: '#14b8a6', name: 'Aqua Mint', vietnamese: 'Xanh Ngọc Bích' },
  { id: '#f43f5e', name: 'Rose Flame', vietnamese: 'Hồng Hồng Ngọc' },
  { id: '#64748b', name: 'Stealth Grey', vietnamese: 'Xám Tàng Hình' },
];

export const TRAIL_STYLES = [
  { id: 'classic', name: 'Classic Ribbon', vietnamese: 'Dải Ruy Băng Gốc' },
  { id: 'rainbow', name: 'Rainbow Flow', vietnamese: 'Dòng Chảy Cầu Vồng' },
  { id: 'fire', name: 'Blazing Fire', vietnamese: 'Lửa Rực Cháy' },
  { id: 'particles', name: 'Stardust Spark', vietnamese: 'Bụi Sao Lấp Lánh' },
];

export const DEATH_EFFECTS = [
  { id: 'shatter', name: 'Geometry Shatter', vietnamese: 'Vỡ Mảnh Kính Gốc' },
  { id: 'explosion', name: 'Plasma Nova', vietnamese: 'Bùng Nổ Plasma' },
  { id: 'implosion', name: 'Black Hole', vietnamese: 'Hố Đen Thu Nhỏ' },
];

export const DEFAULT_CUSTOMIZATION: PlayerCustomization = {
  cubeSkin: 'classic',
  shipSkin: 'classic_dart',
  waveSkin: 'arrow',
  ballSkin: 'techno_wheel',
  ufoSkin: 'classic_saucer',
  primaryColor: '#22c55e', // Iconic green
  secondaryColor: '#06b6d4', // Cyan face
  glowColor: '#ffffff', // White eyes
  glowEnabled: true,
  trailStyle: 'classic',
  deathEffect: 'shatter',
};

const STORAGE_KEY = 'gd_customization_v2';
const HIGHSCORE_KEY = 'gd_highscores_v2';

export function loadCustomization(): PlayerCustomization {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to load customization', e);
  }
  return DEFAULT_CUSTOMIZATION;
}

export function saveCustomization(data: PlayerCustomization): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save customization', e);
  }
}

export interface LevelProgress {
  [levelId: string]: {
    normalPercent: number;
    practicePercent: number;
    attempts: number;
    coinsCollected: number;
  };
}

export function loadLevelProgress(): LevelProgress {
  try {
    const raw = localStorage.getItem(HIGHSCORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load highscores', e);
  }
  return {};
}

export function saveLevelProgress(
  levelId: string,
  normalPercent: number,
  practicePercent: number,
  attemptsInc: number,
  coins: number
): LevelProgress {
  const all = loadLevelProgress();
  const prev = all[levelId] || { normalPercent: 0, practicePercent: 0, attempts: 0, coinsCollected: 0 };
  all[levelId] = {
    normalPercent: Math.max(prev.normalPercent, Math.round(normalPercent)),
    practicePercent: Math.max(prev.practicePercent, Math.round(practicePercent)),
    attempts: prev.attempts + attemptsInc,
    coinsCollected: Math.max(prev.coinsCollected, coins),
  };
  try {
    localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(all));
  } catch (e) {
    console.error('Failed to save highscores', e);
  }
  return all;
}
