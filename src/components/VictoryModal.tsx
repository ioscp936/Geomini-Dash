import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, RotateCcw, ArrowRight, ListMusic } from 'lucide-react';

interface VictoryModalProps {
  levelName: string;
  vietnameseTitle: string;
  attempts: number;
  stars: number;
  coinsCollected: number; // 0 to 3
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelName,
  vietnameseTitle,
  attempts,
  stars,
  coinsCollected,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onLevelSelect,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#ec4899', '#eab308', '#22c55e', '#a855f7'],
    });
  }, []);

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-30 select-none animate-in zoom-in-95 duration-250">
      <div className="bg-slate-900 border border-yellow-500/60 rounded-2xl p-6 max-w-md w-full text-center shadow-[0_0_40px_rgba(234,179,8,0.4)]">
        {/* Trophy Header */}
        <div className="w-16 h-16 mx-auto mb-3 bg-yellow-500/20 border border-yellow-500/40 rounded-full flex items-center justify-center text-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]">
          <Trophy className="w-8 h-8" />
        </div>

        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 font-display mb-1 tracking-wider">
          HOÀN THÀNH 100%!
        </h2>
        <p className="text-xs text-cyan-300 font-mono mb-6">
          {levelName} ({vietnameseTitle})
        </p>

        {/* Mastery Metric Tiles */}
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">ĐIỂM SAO</span>
            <span className="text-xl font-bold text-yellow-400 font-display flex items-center justify-center gap-1">
              +{stars} <Star className="w-4 h-4 fill-current" />
            </span>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">SAO ẨN</span>
            <div className="flex items-center justify-center gap-0.5 text-yellow-400 mt-1">
              {[0, 1, 2].map((i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < coinsCollected ? 'fill-current text-yellow-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl">
            <span className="text-[10px] font-mono text-slate-400 block mb-1">LƯỢT THỬ</span>
            <span className="text-xl font-bold text-white font-display tabular-nums">
              {attempts}
            </span>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-3">
          {hasNextLevel ? (
            <button
              data-start="true"
              onClick={onNextLevel}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-slate-950 font-black rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(234,179,8,0.5)] cursor-pointer"
            >
              <span>MÀN TIẾP THEO</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              data-start="true"
              onClick={onReplay}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-black rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>CHƠI LẠI</span>
            </button>
          )}

          <div className="flex gap-2">
            {hasNextLevel && (
              <button
                onClick={onReplay}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs rounded-lg active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>CHƠI LẠI</span>
              </button>
            )}

            <button
              onClick={onLevelSelect}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs rounded-lg active:scale-95 transition-all cursor-pointer"
            >
              <ListMusic className="w-4 h-4" />
              <span>CHỌN MÀN</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
