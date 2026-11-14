import React from 'react';
import { X, Check, RotateCw, Sparkles, Flame, Zap, Shield, Eye } from 'lucide-react';
import { GameMode, PlayerCustomization } from '../types';
import {
  BALL_SKINS,
  COLOR_PALETTE,
  CUBE_SKINS,
  DEATH_EFFECTS,
  SHIP_SKINS,
  TRAIL_STYLES,
  UFO_SKINS,
  WAVE_SKINS,
} from '../game/customization';

interface CustomizerModalProps {
  customization: PlayerCustomization;
  previewMode: GameMode;
  onChangePreviewMode: (mode: GameMode) => void;
  onUpdateCustomization: (cust: PlayerCustomization) => void;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  customization,
  previewMode,
  onChangePreviewMode,
  onUpdateCustomization,
  onClose,
}) => {
  const [activeTab, setActiveTab] = React.useState<'skins' | 'colors' | 'effects'>('skins');

  const updateCust = (patch: Partial<PlayerCustomization>) => {
    onUpdateCustomization({ ...customization, ...patch });
  };

  return (
    <div className="absolute inset-0 bg-black/85 flex items-center justify-center p-4 z-20 select-none">
      <div className="bg-slate-900 border border-pink-500/50 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-[0_0_40px_rgba(236,72,153,0.3)] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 font-display">
              TÙY CHỈNH NHÂN VẬT & HIỆU ỨNG
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Biến hóa ngoại hình khối vuông, phi thuyền, sóng và hiệu ứng ánh sáng
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

        {/* Mode Preview Bar & Section Tabs */}
        <div className="px-6 py-3 bg-slate-950/50 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <span className="text-xs font-mono text-slate-400 px-2">Dạng xem:</span>
            {(['cube', 'ship', 'wave', 'ball', 'ufo'] as GameMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => onChangePreviewMode(mode)}
                className={`px-3 py-1 rounded text-xs font-bold uppercase transition-all cursor-pointer ${
                  previewMode === mode
                    ? 'bg-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.5)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                {mode === 'cube' ? 'Khối Vuông' : mode === 'ship' ? 'Phi Thuyền' : mode === 'wave' ? 'Sóng Lôi' : mode === 'ball' ? 'Lăn Bóng' : 'Đĩa Bay UFO'}
              </button>
            ))}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('skins')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'skins'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Mẫu Ngoại Hình (Skins)
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'colors'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Bảng Màu Neon
            </button>
            <button
              onClick={() => setActiveTab('effects')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'effects'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Vệt Sáng & Vụ Nổ
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: SKINS */}
          {activeTab === 'skins' && (
            <div className="space-y-6">
              {previewMode === 'cube' && (
                <div>
                  <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Mẫu Khối Vuông (Cube Skins)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {CUBE_SKINS.map((skin) => {
                      const isSelected = customization.cubeSkin === skin.id;
                      return (
                        <button
                          key={skin.id}
                          onClick={() => updateCust({ cubeSkin: skin.id })}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-400">{skin.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <span className="text-sm font-bold text-white">{skin.vietnameseName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {previewMode === 'ship' && (
                <div>
                  <h4 className="text-sm font-bold text-pink-400 mb-3 flex items-center gap-1.5">
                    <Zap className="w-4 h-4" /> Mẫu Phi Thuyền (Ship Skins)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {SHIP_SKINS.map((skin) => {
                      const isSelected = customization.shipSkin === skin.id;
                      return (
                        <button
                          key={skin.id}
                          onClick={() => updateCust({ shipSkin: skin.id })}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-pink-950/80 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)]'
                              : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-400">{skin.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-pink-400" />}
                          </div>
                          <span className="text-sm font-bold text-white">{skin.vietnameseName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {previewMode === 'wave' && (
                <div>
                  <h4 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-1.5">
                    <Flame className="w-4 h-4" /> Mẫu Sóng (Wave Skins)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {WAVE_SKINS.map((skin) => {
                      const isSelected = customization.waveSkin === skin.id;
                      return (
                        <button
                          key={skin.id}
                          onClick={() => updateCust({ waveSkin: skin.id })}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                              : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-400">{skin.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                          </div>
                          <span className="text-sm font-bold text-white">{skin.vietnameseName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {previewMode === 'ball' && (
                <div>
                  <h4 className="text-sm font-bold text-yellow-400 mb-3 flex items-center gap-1.5">
                    <RotateCw className="w-4 h-4" /> Mẫu Lăn Bóng (Ball Skins)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {BALL_SKINS.map((skin) => {
                      const isSelected = customization.ballSkin === skin.id;
                      return (
                        <button
                          key={skin.id}
                          onClick={() => updateCust({ ballSkin: skin.id })}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-yellow-950/80 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]'
                              : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-400">{skin.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-yellow-400" />}
                          </div>
                          <span className="text-sm font-bold text-white">{skin.vietnameseName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {previewMode === 'ufo' && (
                <div>
                  <h4 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Mẫu Đĩa Bay (UFO Skins)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {UFO_SKINS.map((skin) => {
                      const isSelected = customization.ufoSkin === skin.id;
                      return (
                        <button
                          key={skin.id}
                          onClick={() => updateCust({ ufoSkin: skin.id })}
                          className={`p-3 rounded-xl border text-left flex flex-col justify-between h-24 transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                              : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-mono text-slate-400">{skin.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                          </div>
                          <span className="text-sm font-bold text-white">{skin.vietnameseName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COLORS */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              {/* Primary Color */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Màu Sắc Chính (Primary Body)
                  </h4>
                  <span className="text-xs font-mono text-cyan-400">{customization.primaryColor}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {COLOR_PALETTE.map((c) => {
                    const isSelected = customization.primaryColor === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => updateCust({ primaryColor: c.id })}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-black/40 shrink-0"
                          style={{ backgroundColor: c.id }}
                        />
                        <span className="truncate">{c.vietnamese}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Màu Chi Tiết Phụ (Secondary Accent)
                  </h4>
                  <span className="text-xs font-mono text-cyan-400">{customization.secondaryColor}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {COLOR_PALETTE.map((c) => {
                    const isSelected = customization.secondaryColor === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => updateCust({ secondaryColor: c.id })}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-black/40 shrink-0"
                          style={{ backgroundColor: c.id }}
                        />
                        <span className="truncate">{c.vietnamese}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glow Accent Color */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Màu Mắt & Đèn Neon (Glow Color)
                  </h4>
                  <span className="text-xs font-mono text-cyan-400">{customization.glowColor}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {COLOR_PALETTE.map((c) => {
                    const isSelected = customization.glowColor === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => updateCust({ glowColor: c.id })}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-white shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                            : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full border border-black/40 shrink-0"
                          style={{ backgroundColor: c.id }}
                        />
                        <span className="truncate">{c.vietnamese}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EFFECTS */}
          {activeTab === 'effects' && (
            <div className="space-y-6">
              {/* Trail Style */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Hiệu Ứng Vệt Đuôi (Trail Styles)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {TRAIL_STYLES.map((t) => {
                    const isSelected = customization.trailStyle === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => updateCust({ trailStyle: t.id as PlayerCustomization['trailStyle'] })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-slate-400">{t.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                        </div>
                        <span className="text-sm font-bold text-white">{t.vietnamese}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Death Effect */}
              <div>
                <h4 className="text-sm font-bold text-white mb-3">Hiệu Ứng Nổ Khi Va Chạm (Death Effects)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DEATH_EFFECTS.map((d) => {
                    const isSelected = customization.deathEffect === d.id;
                    return (
                      <button
                        key={d.id}
                        onClick={() => updateCust({ deathEffect: d.id as PlayerCustomization['deathEffect'] })}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-950/80 border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                            : 'bg-slate-800/60 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-mono text-slate-400">{d.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                        </div>
                        <span className="text-sm font-bold text-white">{d.vietnamese}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-bold text-sm rounded-lg active:scale-95 transition-all shadow-md cursor-pointer"
          >
            LƯU & QUAY LẠI
          </button>
        </div>
      </div>
    </div>
  );
};
