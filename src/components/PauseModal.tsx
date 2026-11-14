import React from 'react';
import { Play, RotateCcw, ListMusic, Flag, Volume2 } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onLevelSelect: () => void;
  isPracticeMode: boolean;
  onTogglePracticeMode: () => void;
  volume: number;
  onChangeVolume: (vol: number) => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onLevelSelect,
  isPracticeMode,
  onTogglePracticeMode,
  volume,
  onChangeVolume,
}) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4 z-30 select-none">
      <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 max-w-sm w-full text-center shadow-[0_0_30px_rgba(6,182,212,0.3)]">
        <h2 className="text-3xl font-black text-white font-display mb-6 tracking-wider">
          TẠM DỪNG
        </h2>

        <div className="space-y-3 mb-6">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>TIẾP TỤC [Esc / P]</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-white font-semibold rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>CHƠI LẠI [R]</span>
          </button>

          <button
            onClick={onTogglePracticeMode}
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border font-semibold text-xs active:scale-95 transition-all cursor-pointer ${
              isPracticeMode
                ? 'bg-yellow-950/80 border-yellow-500/60 text-yellow-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <Flag className="w-4 h-4" />
            <span>Chế độ Luyện tập: {isPracticeMode ? 'BẬT' : 'TẮT'}</span>
          </button>

          <button
            onClick={onLevelSelect}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-300 font-semibold rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            <ListMusic className="w-4 h-4" />
            <span>CHỌN MÀN CHƠI</span>
          </button>
        </div>

        {/* Volume Slider */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <span className="text-xs font-mono text-slate-400 w-8">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};
