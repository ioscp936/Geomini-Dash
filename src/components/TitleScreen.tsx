import React from 'react';
import { Play, Palette, ListMusic, Volume2, VolumeX, HelpCircle, Sparkles, Layers } from 'lucide-react';
import { RenderMode } from '../types';

interface TitleScreenProps {
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onOpenCustomizer: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  renderMode: RenderMode;
  onToggleRenderMode: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onOpenLevelSelect,
  onOpenCustomizer,
  isMuted,
  onToggleMute,
  renderMode,
  onToggleRenderMode,
}) => {
  const [showHelp, setShowHelp] = React.useState(false);

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none select-none z-10">
      {/* Top Header Utilities */}
      <div className="flex justify-between items-center w-full pointer-events-auto">
        <div className="flex items-center gap-3">
          {/* Mode Switch: 2D Gốc vs 3D */}
          <button
            onClick={onToggleRenderMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer shadow-md ${
              renderMode === '2d'
                ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 hover:border-cyan-400'
            }`}
            title="Nhấn để đổi giữa Bản 2D Gốc và Bản 3D"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CHẾ ĐỘ: {renderMode === '2d' ? '2D GỐC (CLASSIC)' : '3D KHÔNG GIAN'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 bg-slate-900/90 border border-slate-700 hover:border-yellow-400 rounded-lg text-slate-200 transition-colors cursor-pointer"
            title="Hướng dẫn điều khiển"
            aria-label="Hướng dẫn điều khiển"
          >
            <HelpCircle className="w-4 h-4 text-yellow-400" />
          </button>
          <button
            onClick={onToggleMute}
            className="p-2 bg-slate-900/90 border border-slate-700 hover:border-cyan-400 rounded-lg text-slate-200 transition-colors cursor-pointer"
            title="Âm thanh [Phím M]"
            aria-label="Âm thanh"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            )}
          </button>
        </div>
      </div>

      {/* Main Title Emblem Lockup */}
      <div className="flex flex-col items-center justify-center my-auto text-center pointer-events-auto">
        <div className="relative mb-2">
          <div className="absolute -inset-4 bg-gradient-to-r from-yellow-500/20 via-pink-500/20 to-cyan-500/20 blur-xl opacity-80" />

          <h1 className="relative text-5xl md:text-7xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-emerald-300 to-cyan-400 drop-shadow-[0_0_25px_rgba(234,179,8,0.6)] font-display">
            GEOMETRY DASH
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs md:text-sm font-semibold tracking-widest text-cyan-300 uppercase drop-shadow mb-8">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>NHẠC EDM PHỔ BIẾN · BẢN 2D CHUẨN GỐC</span>
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </div>

        {/* Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            data-start="true"
            onClick={onStartGame}
            className="w-full sm:flex-1 group relative flex items-center justify-center gap-2 py-4 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-slate-950 font-bold text-lg rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.6)] active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-6 h-6 fill-current transition-transform group-hover:scale-110" />
            <span>CHƠI NGAY</span>
          </button>

          <button
            onClick={onOpenLevelSelect}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-slate-900/90 hover:bg-slate-800 border-2 border-cyan-500/60 hover:border-cyan-400 text-cyan-300 font-bold rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 transition-all cursor-pointer"
          >
            <ListMusic className="w-5 h-5" />
            <span>CHỌN BÀI NHẠC</span>
          </button>
        </div>

        <div className="mt-4">
          <button
            onClick={onOpenCustomizer}
            className="flex items-center justify-center gap-2 py-2.5 px-6 bg-slate-900/80 hover:bg-slate-800 border border-pink-500/50 hover:border-pink-400 text-pink-300 font-medium text-sm rounded-lg active:scale-95 transition-all cursor-pointer"
          >
            <Palette className="w-4 h-4" />
            <span>TÙY CHỈNH NHÂN VẬT & MÀU SẮC</span>
          </button>
        </div>

        {/* 14 Levels Collection Preview */}
        <div className="mt-6 flex flex-col items-center gap-2 max-w-xl text-center">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-yellow-300">
            <span>🔥 14 MÀN CHƠI ĐẲNG CẤP · ĐỘ KHÓ TĂNG DẦN TỪ DỄ ĐẾN SIÊU ÁC QUỶ 🔥</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-cyan-400">#1 Stereo Madness</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-green-400">#2 Back On Track</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-purple-400">#3 Polargeist</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-orange-400">#4 Dry Out</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-pink-400">#6 Can't Let Go</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-amber-400">#7 Jumper</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-indigo-400">#9 Cycles</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-blue-400">#10 xStep</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-emerald-400">#11 Clutterfunk</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-red-400">#13 Clubstep</span>
            <span className="px-2 py-0.5 bg-slate-950/80 border border-slate-800 rounded text-rose-400 font-bold">#14 Deadlocked</span>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 pointer-events-auto z-30">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-xl p-6 max-w-lg w-full text-left shadow-2xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 font-display">HƯỚNG DẪN CƠ CHẾ ĐIỀU KHIỂN BẢN 2D</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">Khối Vuông (Cube):</span>
                <span>Nhấn [Space / Chuột / Phím ↑] để nhảy</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">Phi Thuyền (Ship):</span>
                <span>Giữ để bay lên, thả để rơi xuống</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">Sóng Lôi Điện (Wave):</span>
                <span>Giữ để bay chéo 45° lên, thả để lao xuống</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">Lăn Bóng (Ball):</span>
                <span>Nhấn để đảo trọng lực giữa sàn và trần</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">Đĩa Bay (UFO):</span>
                <span>Nhấn nhảy liên tục giữa không trung</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-fuchsia-400">Cổng Thu Nhỏ (MINI / MAX):</span>
                <span>Thu nhỏ 0.6x nhảy nhanh hoặc phóng lớn lại</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-cyan-400">Cổng Dịch Chuyển (TP):</span>
                <span>Dịch chuyển không gian tức thời tới cổng ra</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-amber-400">Cổng Tốc Độ (&gt; / &gt;&gt; / &gt;&gt;&gt;):</span>
                <span>Tăng tốc độ 2x, 3x hoặc trở về 1x</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-white">Chế độ Luyện tập:</span>
                <span>Phím [Z] đặt cờ mốc · Phím [X] xóa mốc</span>
              </div>
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-6 w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded cursor-pointer transition-colors"
            >
              ĐÃ HIỂU, ĐÓNG LẠI
            </button>
          </div>
        </div>
      )}

      {/* Flat borderless control hint on bottom safe margin */}
      <div className="w-full text-center text-xs font-mono text-slate-400 tracking-wider pointer-events-none">
        Space / Click / ↑ : Nhảy · Z: Đặt cờ · X: Xóa cờ · Esc / P: Tạm dừng
      </div>
    </div>
  );
};
