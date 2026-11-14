import React from 'react';
import { Pause, Star, Flag, RotateCcw, Eye, Volume2, VolumeX } from 'lucide-react';
import { CameraViewMode, GameMode } from '../types';

interface PlayingHUDProps {
  levelName: string;
  vietnameseTitle: string;
  songArtist?: string;
  songTrackName?: string;
  progressPercent: number;
  attempts: number;
  coinsCollected: number; // 0-3
  isPracticeMode: boolean;
  checkpointCount: number;
  currentMode: GameMode;
  isMini?: boolean;
  speedMultiplier?: number;
  cameraMode: CameraViewMode;
  isMuted: boolean;
  onPause: () => void;
  onPlaceCheckpoint: () => void;
  onRemoveCheckpoint: () => void;
  onToggleCamera: () => void;
  onToggleMute: () => void;
}

export const PlayingHUD: React.FC<PlayingHUDProps> = ({
  levelName,
  vietnameseTitle,
  songArtist,
  songTrackName,
  progressPercent,
  attempts,
  coinsCollected,
  isPracticeMode,
  checkpointCount,
  currentMode,
  isMini = false,
  speedMultiplier = 1,
  cameraMode,
  isMuted,
  onPause,
  onPlaceCheckpoint,
  onRemoveCheckpoint,
  onToggleCamera,
  onToggleMute,
}) => {
  const getModeLabel = (mode: GameMode) => {
    switch (mode) {
      case 'cube':
        return 'KHỐI VUÔNG';
      case 'ship':
        return 'PHI THUYỀN';
      case 'wave':
        return 'SÓNG';
      case 'ball':
        return 'LĂN BÓNG';
      case 'ufo':
        return 'ĐĨA BAY UFO';
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-10 flex flex-col justify-between p-4">
      {/* Top Bar: Progress & Level Info */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Top Minimal Info Line */}
        <div className="flex justify-between items-center w-full px-2 mb-1.5 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider font-display">{levelName}</span>
            {songTrackName && (
              <span className="text-yellow-400 font-mono text-[11px] hidden sm:inline">
                ♫ {songArtist} - {songTrackName}
              </span>
            )}
            {isPracticeMode && (
              <span className="px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded text-[10px] font-bold">
                LUYỆN TẬP
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Lượt thử: <strong className="text-white">{attempts}</strong>
            </span>
            {/* Secret Coins */}
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < coinsCollected ? 'text-yellow-400 fill-current' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-cyan-400 font-bold text-sm tracking-widest tabular-nums">
              {Math.min(100, Math.max(0, Math.round(progressPercent)))}%
            </span>
          </div>
        </div>

        {/* Smooth Neon Progress Bar */}
        <div className="w-full h-2 bg-slate-950/80 rounded-full overflow-hidden border border-slate-700/60 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-pink-500 transition-all duration-75"
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      </div>

      {/* Top Right Utilities */}
      <div className="absolute top-4 right-4 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onToggleCamera}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-lg text-slate-200 transition-colors"
          title={`Đổi Camera [C] - Hiện tại: ${cameraMode.toUpperCase()}`}
          aria-label="Đổi góc nhìn Camera"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
        </button>

        <button
          onClick={onToggleMute}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-lg text-slate-200 transition-colors"
          title="Âm thanh [M]"
          aria-label="Âm thanh"
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          )}
        </button>

        <button
          onClick={onPause}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-400 rounded-lg text-slate-200 transition-colors cursor-pointer"
          title="Tạm dừng [Esc / P]"
          aria-label="Tạm dừng game"
        >
          <Pause className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Bottom Practice Mode Dock (Only shown when Practice Mode is active) */}
      {isPracticeMode && (
        <div className="w-full flex justify-center items-center pointer-events-auto">
          <div className="flex items-center gap-3 bg-slate-900/90 border border-yellow-500/50 rounded-xl px-4 py-2 shadow-[0_0_20px_rgba(234,179,8,0.25)]">
            <button
              onClick={onPlaceCheckpoint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold text-xs rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <Flag className="w-4 h-4 fill-current" />
              <span>Đặt mốc [Z]</span>
            </button>

            <button
              onClick={onRemoveCheckpoint}
              disabled={checkpointCount === 0}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                checkpointCount > 0
                  ? 'bg-slate-800 hover:bg-rose-950 border border-rose-500/50 text-rose-400 active:scale-95 cursor-pointer'
                  : 'bg-slate-800/40 text-slate-600 border border-slate-800 cursor-not-allowed'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa mốc [X] ({checkpointCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode Badge Bottom Left */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 bg-slate-900/80 border border-slate-700 rounded text-slate-300 font-mono text-xs flex items-center gap-2">
          <span>
            DẠNG: <span className="text-cyan-400 font-bold">{getModeLabel(currentMode)}</span>
          </span>
          {isMini && (
            <span className="px-1.5 py-0.5 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/50 rounded text-[10px] font-bold">
              MINI
            </span>
          )}
          {speedMultiplier > 1 && (
            <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded text-[10px] font-bold">
              {speedMultiplier >= 1.6 ? '3x' : '2x'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
