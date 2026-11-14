import React from 'react';
import { RotateCcw, ListMusic, Flag, Award } from 'lucide-react';

interface GameOverModalProps {
  progressPercent: number;
  bestPercent: number;
  attempts: number;
  isPracticeMode: boolean;
  onRestart: () => void;
  onLevelSelect: () => void;
  onTogglePracticeMode: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  progressPercent,
  bestPercent,
  attempts,
  isPracticeMode,
  onRestart,
  onLevelSelect,
  onTogglePracticeMode,
}) => {
  const roundedPercent = Math.min(100, Math.max(0, Math.round(progressPercent)));
  const roundedBest = Math.max(roundedPercent, Math.round(bestPercent));

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-30 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-rose-500/50 rounded-2xl p-6 max-w-sm w-full text-center shadow-[0_0_35px_rgba(244,63,94,0.3)]">
        <h2 className="text-3xl font-black text-rose-500 font-display mb-1 tracking-wider drop-shadow-[0_0_15px_rgba(244,63,94,0.6)]">
          THẤT BẠI!
        </h2>
        <p className="text-xs text-slate-400 font-mono mb-6">
          {isPracticeMode ? 'Chế độ Luyện tập' : 'Chế độ Tiêu chuẩn'}
        </p>

        {/* Progress Metrics Tiles */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">TIẾN TRÌNH</span>
            <span className="text-2xl font-black text-white font-display tabular-nums">
              {roundedPercent}%
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[11px] font-mono text-slate-400 block mb-1">KỶ LỤC TỐT NHẤT</span>
            <span className="text-2xl font-black text-yellow-400 font-display tabular-nums">
              {roundedBest}%
            </span>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400 mb-6 flex justify-between px-2">
          <span>Lượt thử hiện tại:</span>
          <strong className="text-white">{attempts}</strong>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            data-start="true"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-bold rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(244,63,94,0.4)] cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>THỬ LẠI [Space / Enter]</span>
          </button>

          {!isPracticeMode && (
            <button
              onClick={onTogglePracticeMode}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-yellow-950/60 hover:bg-yellow-900/60 border border-yellow-500/40 text-yellow-300 font-semibold text-xs rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <Flag className="w-4 h-4" />
              <span>Chuyển sang Luyện tập (Đặt cờ [Z])</span>
            </button>
          )}

          <button
            onClick={onLevelSelect}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold rounded-lg active:scale-95 transition-all cursor-pointer text-xs"
          >
            <ListMusic className="w-4 h-4" />
            <span>CHỌN MÀN KHÁC</span>
          </button>
        </div>
      </div>
    </div>
  );
};
