import React, { useState } from 'react';
import { Play, Star, X, Flag, Flame, ShieldAlert, Sparkles, Award, Music2, Gauge } from 'lucide-react';
import { CameraViewMode, LevelData, RenderMode } from '../types';
import { LevelProgress } from '../game/customization';

interface LevelSelectModalProps {
  levels: LevelData[];
  selectedLevelId: string;
  onSelectLevel: (levelId: string) => void;
  onStartLevel: (levelId: string) => void;
  onClose: () => void;
  progress: LevelProgress;
  isPracticeMode: boolean;
  onTogglePracticeMode: (enabled: boolean) => void;
  cameraMode: CameraViewMode;
  onSelectCameraMode: (mode: CameraViewMode) => void;
  renderMode: RenderMode;
  onToggleRenderMode: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  levels,
  selectedLevelId,
  onSelectLevel,
  onStartLevel,
  onClose,
  progress,
  isPracticeMode,
  onTogglePracticeMode,
  renderMode,
  onToggleRenderMode,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'easy' | 'hard' | 'demon'>('all');

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/40 rounded text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Dễ
          </span>
        );
      case 'Normal':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/40 rounded text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Thường
          </span>
        );
      case 'Hard':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded text-xs font-bold uppercase">
            <Award className="w-3.5 h-3.5" /> Khó
          </span>
        );
      case 'Harder':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/40 rounded text-xs font-bold uppercase">
            <Award className="w-3.5 h-3.5" /> Khó Hơn
          </span>
        );
      case 'Insane':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-pink-500/20 text-pink-400 border border-pink-500/40 rounded text-xs font-bold uppercase">
            <Flame className="w-3.5 h-3.5" /> Điên Cuồng
          </span>
        );
      case 'Demon':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 rounded text-xs font-bold uppercase">
            <ShieldAlert className="w-3.5 h-3.5" /> Ác Quỷ
          </span>
        );
      case 'Extreme Demon':
        return (
          <span className="flex items-center gap-1 px-2.5 py-0.5 bg-purple-500/25 text-purple-300 border border-purple-500/50 rounded text-xs font-bold uppercase shadow-[0_0_10px_rgba(168,85,247,0.4)]">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> Siêu Ác Quỷ
          </span>
        );
      default:
        return null;
    }
  };

  const filteredLevels = levels.filter((lvl, idx) => {
    if (filterCategory === 'easy') return idx < 5;
    if (filterCategory === 'hard') return idx >= 5 && idx < 9;
    if (filterCategory === 'demon') return idx >= 9;
    return true;
  });

  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-3 sm:p-4 z-20 select-none">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_0_40px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-cyan-400 to-pink-500 font-display">
              14 MÀN CHƠI & BẢN NHẠC EDM HUYỀN THOẠI
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Độ khó tăng tiến dần từ Dễ đến Siêu Ác Quỷ · Âm thanh EDM đỉnh cao
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Global Level Options & Filters */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterCategory('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả (14)
            </button>
            <button
              onClick={() => setFilterCategory('easy')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'easy'
                  ? 'bg-green-500 text-slate-950 shadow-[0_0_12px_rgba(34,197,94,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Dễ & Thường (1-5)
            </button>
            <button
              onClick={() => setFilterCategory('hard')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'hard'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Khó & Khó Hơn (6-9)
            </button>
            <button
              onClick={() => setFilterCategory('demon')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterCategory === 'demon'
                  ? 'bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Điên Cuồng & Demon (10-14)
            </button>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={isPracticeMode}
                onChange={(e) => onTogglePracticeMode(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-yellow-500 focus:ring-0 bg-slate-800 border-slate-600 cursor-pointer"
              />
              <Flag className={`w-3.5 h-3.5 ${isPracticeMode ? 'text-yellow-400' : 'text-slate-500'}`} />
              <span className={`font-semibold ${isPracticeMode ? 'text-yellow-300' : 'text-slate-400'}`}>
                Luyện tập [Z]
              </span>
            </label>

            <button
              onClick={onToggleRenderMode}
              className={`px-2.5 py-1 rounded border text-xs font-bold transition-all cursor-pointer ${
                renderMode === '2d'
                  ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-sm'
                  : 'bg-cyan-950 text-cyan-300 border-cyan-500'
              }`}
            >
              Chế độ: {renderMode === '2d' ? '2D Gốc' : '3D'}
            </button>
          </div>
        </div>

        {/* Level List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3.5 flex-1 custom-scrollbar">
          {filteredLevels.map((lvl) => {
            const isSelected = lvl.id === selectedLevelId;
            const fullIndex = levels.findIndex((l) => l.id === lvl.id) + 1;
            const lvlProgress = progress[lvl.id] || { normalPercent: 0, practicePercent: 0, attempts: 0, coinsCollected: 0 };

            return (
              <div
                key={lvl.id}
                onClick={() => onSelectLevel(lvl.id)}
                className={`relative p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  isSelected
                    ? 'bg-slate-800/95 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                {/* Left Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                    <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-black text-cyan-300 font-mono">
                      #{fullIndex}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display">
                      {lvl.name}
                    </h3>
                    <span className="text-xs text-cyan-300 font-mono tracking-wide">
                      ({lvl.vietnameseTitle})
                    </span>
                    {getDifficultyBadge(lvl.difficulty)}
                    <div className="flex items-center gap-0.5 text-yellow-400">
                      {Array.from({ length: Math.min(lvl.stars, 5) }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                      {lvl.stars > 5 && (
                        <span className="text-[11px] font-mono font-bold ml-0.5 text-yellow-400">
                          (★{lvl.stars})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Song Artist & Track Badge */}
                  <div className="flex items-center gap-1.5 text-xs text-yellow-400 font-semibold mb-2">
                    <Music2 className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Bài nhạc: <strong className="text-white">{lvl.songArtist} - {lvl.songTrackName}</strong></span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 max-w-xl leading-relaxed">
                    {lvl.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400 flex-wrap">
                    <span>BPM: <strong className="text-cyan-300">{lvl.bpm}</strong></span>
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                      Tốc độ: <strong className="text-emerald-300">{lvl.baseSpeed.toFixed(1)}</strong>
                    </span>
                    <span>Lượt thử: <strong className="text-slate-200">{lvlProgress.attempts}</strong></span>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Sao ẩn:</span>
                      {[0, 1, 2].map((coinIndex) => (
                        <Star
                          key={coinIndex}
                          className={`w-3.5 h-3.5 ${
                            coinIndex < lvlProgress.coinsCollected
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]'
                              : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Progress & Launch CTA */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                  <div className="flex flex-col items-start md:items-end gap-1">
                    <div className="text-xs font-mono">
                      <span className="text-slate-400">Tiến trình Thường: </span>
                      <strong className={`text-sm ${lvlProgress.normalPercent === 100 ? 'text-green-400' : 'text-cyan-300'}`}>
                        {lvlProgress.normalPercent}%
                      </strong>
                    </div>
                    {lvlProgress.practicePercent > 0 && (
                      <div className="text-xs font-mono">
                        <span className="text-slate-400">Luyện tập: </span>
                        <strong className="text-yellow-400">{lvlProgress.practicePercent}%</strong>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartLevel(lvl.id);
                    }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>CHƠI BÀI NÀY</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
