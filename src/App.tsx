/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { CameraViewMode, CheckpointData, GameMode, GameState, PlayerCustomization, RenderMode } from './types';
import { LEVELS } from './game/levels';
import {
  DEFAULT_CUSTOMIZATION,
  LevelProgress,
  loadCustomization,
  loadLevelProgress,
  saveCustomization,
  saveLevelProgress,
} from './game/customization';
import { createInitialPhysicsState, PlayerPhysicsState, stepPhysics } from './game/physics';
import { Engine2D } from './game/engine2d';
import { GameRenderer } from './game/renderer';
import { sound } from './game/audio';
import { TitleScreen } from './components/TitleScreen';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CustomizerModal } from './components/CustomizerModal';
import { PlayingHUD } from './components/PlayingHUD';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';

export default function App() {
  const canvas2DRef = useRef<HTMLCanvasElement>(null);
  const canvas3DMountRef = useRef<HTMLDivElement>(null);

  const engine2DRef = useRef<Engine2D | null>(null);
  const renderer3DRef = useRef<GameRenderer | null>(null);

  // High-level Game States (Defaulting to 2D Gốc as requested!)
  const [renderMode, setRenderMode] = useState<RenderMode>('2d');
  const [gameState, setGameState] = useState<GameState>('title');
  const [selectedLevelId, setSelectedLevelId] = useState<string>('stereo_madness');
  const [isPracticeMode, setIsPracticeMode] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<CameraViewMode>('classic');
  const [customization, setCustomization] = useState<PlayerCustomization>(loadCustomization);
  const [progress, setProgress] = useState<LevelProgress>(loadLevelProgress);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);

  // Live HUD States
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(1);
  const [coinsCollectedCount, setCoinsCollectedCount] = useState<number>(0);
  const [checkpointCount, setCheckpointCount] = useState<number>(0);
  const [currentMode, setCurrentMode] = useState<GameMode>('cube');
  const [isMini, setIsMini] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [customizerPreviewMode, setCustomizerPreviewMode] = useState<GameMode>('cube');

  // End-of-Run snapshot states
  const [finalProgressPercent, setFinalProgressPercent] = useState<number>(0);
  const [finalBestPercent, setFinalBestPercent] = useState<number>(0);

  // Mutable Game Loop References
  const playerStateRef = useRef<PlayerPhysicsState>(createInitialPhysicsState('cube'));
  const checkpointsRef = useRef<CheckpointData[]>([]);
  const isHoldingJumpRef = useRef<boolean>(false);
  const justPressedJumpRef = useRef<boolean>(false);
  const collectedCoinsSetRef = useRef<Set<number>>(new Set());
  const attemptsRef = useRef<number>(1);
  const lastTimeRef = useRef<number>(0);
  const gameStateRef = useRef<GameState>('title');
  const selectedLevelRef = useRef(LEVELS[0]);
  const isPracticeModeRef = useRef<boolean>(false);
  const renderModeRef = useRef<RenderMode>('2d');
  const hudThrottleTimerRef = useRef<number>(0);

  // Keep refs in sync with React state
  useEffect(() => {
    gameStateRef.current = gameState;
    document.body.dataset.state =
      gameState === 'victory' || gameState === 'gameover' ? 'gameover' : gameState;
  }, [gameState]);

  useEffect(() => {
    const lvl = LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0];
    selectedLevelRef.current = lvl;
  }, [selectedLevelId]);

  useEffect(() => {
    isPracticeModeRef.current = isPracticeMode;
  }, [isPracticeMode]);

  useEffect(() => {
    renderModeRef.current = renderMode;
  }, [renderMode]);

  // Support ?autostart=1 query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      startGame();
    }
  }, []);

  // 1. Initialize Engines and Game Loop
  useEffect(() => {
    // 2D Engine
    if (canvas2DRef.current) {
      engine2DRef.current = new Engine2D(canvas2DRef.current, customization);
      engine2DRef.current.loadLevel(selectedLevelRef.current);
    }

    // 3D Engine (mounted as backup if user switches to 3D mode)
    if (canvas3DMountRef.current) {
      renderer3DRef.current = new GameRenderer(canvas3DMountRef.current, customization);
      renderer3DRef.current.loadLevel(selectedLevelRef.current);
    }

    // Connect beat pulse to both renderers
    const unbindBeat = sound.onBeat(() => {
      if (engine2DRef.current) engine2DRef.current.triggerBeatPulse();
      if (renderer3DRef.current) renderer3DRef.current.triggerBeatPulse();
    });

    let animId = 0;
    lastTimeRef.current = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      const state = gameStateRef.current;
      const level = selectedLevelRef.current;
      const is2D = renderModeRef.current === '2d';

      if (state === 'playing') {
        const justJump = justPressedJumpRef.current;
        justPressedJumpRef.current = false; // consume one-shot

        const prevMode = playerStateRef.current.mode;
        const prevMini = playerStateRef.current.isMini;
        const prevSpeed = playerStateRef.current.speedMultiplier;
        const result = stepPhysics(
          playerStateRef.current,
          delta,
          isHoldingJumpRef.current,
          justJump,
          level.obstacles
        );

        playerStateRef.current = result.state;

        // Sound triggers
        if (result.events.jumped) sound.playJump();
        if (result.events.hitPad) sound.playPadBounce(result.events.hitPad);
        if (result.events.hitOrb) sound.playOrbHit(result.events.hitOrb);
        if (result.events.hitPortal) {
          sound.playPortalWarp();
          if (result.state.mode !== prevMode) {
            if (is2D && engine2DRef.current) engine2DRef.current.triggerShake(0.3);
            if (!is2D && renderer3DRef.current) renderer3DRef.current.triggerCameraShake(0.3);
            setCurrentMode(result.state.mode);
          }
          if (result.state.isMini !== prevMini) {
            if (is2D && engine2DRef.current) engine2DRef.current.triggerShake(0.2);
            if (!is2D && renderer3DRef.current) renderer3DRef.current.triggerCameraShake(0.2);
            setIsMini(result.state.isMini);
          }
          if (result.state.speedMultiplier !== prevSpeed) {
            setSpeedMultiplier(result.state.speedMultiplier);
          }
        }
        if (result.events.teleported) {
          sound.playPortalWarp();
          if (is2D && engine2DRef.current) {
            engine2DRef.current.triggerShake(0.25);
            engine2DRef.current.emitTrail(result.state.x, result.state.y, customization.glowColor);
          }
          if (!is2D && renderer3DRef.current) {
            renderer3DRef.current.triggerCameraShake(0.25);
            renderer3DRef.current.emitTrail(result.state.x, result.state.y, result.state.z, customization.glowColor, 10);
          }
        }
        if (result.events.collectedCoinId !== undefined) {
          collectedCoinsSetRef.current.add(result.events.collectedCoinId);
          sound.playCoinCollect();
          if (!is2D && renderer3DRef.current) renderer3DRef.current.hideCollectedCoin(result.events.collectedCoinId);
          setCoinsCollectedCount(collectedCoinsSetRef.current.size);
        }

        // Calculate progress %
        const currentPercent = Math.min(100, Math.max(0, (result.state.x / level.trackLength) * 100));

        // Throttle HUD update
        hudThrottleTimerRef.current += delta;
        if (hudThrottleTimerRef.current > 0.1) {
          hudThrottleTimerRef.current = 0;
          setProgressPercent(currentPercent);
        }

        // Victory Condition
        if (result.state.x >= level.trackLength) {
          handleVictory(currentPercent);
        }

        // Death Condition
        if (result.state.isDead || result.events.died) {
          handleDeath(currentPercent);
        }

        if (is2D && engine2DRef.current) {
          engine2DRef.current.renderFrame(result.state, delta, level);
        } else if (!is2D && renderer3DRef.current) {
          renderer3DRef.current.renderFrame(result.state, delta, level.trackLength);
        }
      } else if (state === 'customizer') {
        if (!is2D && renderer3DRef.current) {
          renderer3DRef.current.renderFrame(null, delta, 0);
        } else if (is2D && engine2DRef.current) {
          engine2DRef.current.renderFrame(playerStateRef.current, delta, level, true);
        }
      } else {
        // Idle frame
        if (is2D && engine2DRef.current) {
          engine2DRef.current.renderFrame(playerStateRef.current, delta, level);
        } else if (!is2D && renderer3DRef.current) {
          renderer3DRef.current.renderFrame(playerStateRef.current, delta, level.trackLength);
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      unbindBeat();
      if (engine2DRef.current) engine2DRef.current.dispose();
      if (renderer3DRef.current) renderer3DRef.current.dispose();
      sound.stopMusic();
    };
  }, []);

  // 2. Gameplay Handlers
  const startGame = (levelId?: string) => {
    const targetId = levelId || selectedLevelId;
    setSelectedLevelId(targetId);
    const lvl = LEVELS.find((l) => l.id === targetId) || LEVELS[0];
    selectedLevelRef.current = lvl;

    playerStateRef.current = createInitialPhysicsState('cube');
    checkpointsRef.current = [];
    collectedCoinsSetRef.current.clear();
    setCoinsCollectedCount(0);
    setCheckpointCount(0);
    setCurrentMode('cube');
    setIsMini(false);
    setSpeedMultiplier(1);
    setProgressPercent(0);

    attemptsRef.current = 1;
    setAttempts(1);

    if (engine2DRef.current) {
      engine2DRef.current.loadLevel(lvl);
      engine2DRef.current.setCustomization(customization);
    }
    if (renderer3DRef.current) {
      renderer3DRef.current.setPreviewMode(false);
      renderer3DRef.current.loadLevel(lvl);
      renderer3DRef.current.rebuildPlayer('cube', customization);
    }

    setGameState('playing');
    sound.startMusic(lvl.id, lvl.bpm);
  };

  const handleDeath = (currentPercent: number) => {
    sound.playDeath();
    const p = playerStateRef.current;
    if (renderModeRef.current === '2d' && engine2DRef.current) {
      engine2DRef.current.emitDeathShatter(p.x, p.y, customization.primaryColor);
    } else if (renderer3DRef.current) {
      renderer3DRef.current.emitDeathShatter(p.x, p.y, p.z, customization.primaryColor);
    }

    if (isPracticeModeRef.current && checkpointsRef.current.length > 0) {
      setTimeout(() => {
        const lastCp = checkpointsRef.current[checkpointsRef.current.length - 1];
        playerStateRef.current = {
          ...createInitialPhysicsState(lastCp.mode),
          x: lastCp.x,
          y: lastCp.y,
          z: lastCp.z,
          vy: lastCp.vy,
          mode: lastCp.mode,
          gravityDir: lastCp.gravityDir,
          speedMultiplier: lastCp.speedMultiplier,
          isMini: lastCp.isMini ?? false,
          rotationZ: lastCp.rotationZ,
          isGrounded: false,
        };
        attemptsRef.current += 1;
        setAttempts(attemptsRef.current);
        setCurrentMode(lastCp.mode);
        setIsMini(lastCp.isMini ?? false);
        setSpeedMultiplier(lastCp.speedMultiplier);
      }, 400);
    } else {
      const lvl = selectedLevelRef.current;
      const prevLvlProg = progress[lvl.id] || { normalPercent: 0, practicePercent: 0, attempts: 0, coinsCollected: 0 };
      const newProg = saveLevelProgress(
        lvl.id,
        isPracticeModeRef.current ? prevLvlProg.normalPercent : currentPercent,
        isPracticeModeRef.current ? currentPercent : prevLvlProg.practicePercent,
        attemptsRef.current,
        collectedCoinsSetRef.current.size
      );
      setProgress(newProg);

      setFinalProgressPercent(currentPercent);
      setFinalBestPercent(Math.max(prevLvlProg.normalPercent, Math.round(currentPercent)));

      setTimeout(() => {
        setGameState('gameover');
        sound.stopMusic();
      }, 450);
    }
  };

  const handleVictory = (currentPercent: number) => {
    sound.playVictory();
    const lvl = selectedLevelRef.current;
    const newProg = saveLevelProgress(
      lvl.id,
      100,
      100,
      attemptsRef.current,
      collectedCoinsSetRef.current.size
    );
    setProgress(newProg);

    setTimeout(() => {
      setGameState('victory');
      sound.stopMusic();
    }, 400);
  };

  const restartLevel = () => {
    startGame(selectedLevelId);
  };

  const placeCheckpoint = () => {
    if (!isPracticeModeRef.current) return;
    const p = playerStateRef.current;
    checkpointsRef.current.push({
      x: p.x,
      y: p.y,
      z: p.z,
      vy: p.vy,
      mode: p.mode,
      gravityDir: p.gravityDir,
      speedMultiplier: p.speedMultiplier,
      isMini: p.isMini,
      rotationX: p.rotationX,
      rotationZ: p.rotationZ,
    });
    setCheckpointCount(checkpointsRef.current.length);
    sound.playCheckpoint();
  };

  const removeCheckpoint = () => {
    if (checkpointsRef.current.length > 0) {
      checkpointsRef.current.pop();
      setCheckpointCount(checkpointsRef.current.length);
      sound.playCheckpoint();
    }
  };

  const toggleRenderMode = () => {
    const nextMode = renderMode === '2d' ? '3d' : '2d';
    setRenderMode(nextMode);
    renderModeRef.current = nextMode;
  };

  const toggleCameraMode = () => {
    const modes: CameraViewMode[] = ['classic', 'chase', 'iso'];
    const nextIdx = (modes.indexOf(cameraMode) + 1) % modes.length;
    const nextMode = modes[nextIdx];
    setCameraMode(nextMode);
    if (renderer3DRef.current) renderer3DRef.current.setViewMode(nextMode);
  };

  const handleSelectCameraMode = (mode: CameraViewMode) => {
    setCameraMode(mode);
    if (renderer3DRef.current) renderer3DRef.current.setViewMode(mode);
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    sound.setVolume(vol);
  };

  // Customizer Handlers
  const handleOpenCustomizer = () => {
    setGameState('customizer');
    if (renderer3DRef.current) {
      renderer3DRef.current.setPreviewMode(true);
      renderer3DRef.current.rebuildPlayer(customizerPreviewMode, customization);
    }
  };

  const handleCloseCustomizer = () => {
    saveCustomization(customization);
    setGameState('title');
    if (renderer3DRef.current) {
      renderer3DRef.current.setPreviewMode(false);
      renderer3DRef.current.rebuildPlayer('cube', customization);
    }
    if (engine2DRef.current) {
      engine2DRef.current.setCustomization(customization);
    }
  };

  const handleUpdateCustomization = (newCust: PlayerCustomization) => {
    setCustomization(newCust);
    if (engine2DRef.current) {
      engine2DRef.current.setCustomization(newCust);
    }
    if (renderer3DRef.current) {
      renderer3DRef.current.rebuildPlayer(customizerPreviewMode, newCust);
    }
  };

  const handleChangePreviewMode = (mode: GameMode) => {
    setCustomizerPreviewMode(mode);
    if (renderer3DRef.current) {
      renderer3DRef.current.rebuildPlayer(mode, customization);
    }
  };

  // 3. Global Input Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        isHoldingJumpRef.current = true;
        justPressedJumpRef.current = true;

        if (gameStateRef.current === 'title' || gameStateRef.current === 'gameover') {
          startGame();
        }
      }

      if (e.code === 'Enter') {
        if (gameStateRef.current === 'title' || gameStateRef.current === 'gameover') {
          startGame();
        }
      }

      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (gameStateRef.current === 'playing') {
          setGameState('paused');
          sound.stopMusic();
        } else if (gameStateRef.current === 'paused') {
          setGameState('playing');
          const lvl = selectedLevelRef.current;
          sound.startMusic(lvl.id, lvl.bpm);
        }
      }

      if (e.code === 'KeyR' && (gameStateRef.current === 'playing' || gameStateRef.current === 'paused')) {
        restartLevel();
      }

      if (e.code === 'KeyZ' && gameStateRef.current === 'playing') {
        placeCheckpoint();
      }

      if (e.code === 'KeyX' && gameStateRef.current === 'playing') {
        removeCheckpoint();
      }

      if (e.code === 'KeyC') {
        toggleCameraMode();
      }

      if (e.code === 'KeyM') {
        toggleMute();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        isHoldingJumpRef.current = false;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('input')) return;

      if (gameStateRef.current === 'playing') {
        isHoldingJumpRef.current = true;
        justPressedJumpRef.current = true;
      }
    };

    const handlePointerUp = () => {
      isHoldingJumpRef.current = false;
    };

    const handleWindowBlur = () => {
      isHoldingJumpRef.current = false;
      justPressedJumpRef.current = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [gameState, selectedLevelId, customization, cameraMode, isMuted, renderMode]);

  const currentLvl = LEVELS.find((l) => l.id === selectedLevelId) || LEVELS[0];
  const currentLvlIndex = LEVELS.findIndex((l) => l.id === selectedLevelId);
  const nextLvl = currentLvlIndex >= 0 && currentLvlIndex < LEVELS.length - 1 ? LEVELS[currentLvlIndex + 1] : null;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05050c]">
      {/* 2D Canvas Engine (Primary authentic Geometry Dash 2D Viewport) */}
      <canvas
        ref={canvas2DRef}
        data-testid="canvas-2d"
        className={`absolute inset-0 w-full h-full cursor-pointer ${
          renderMode === '2d' ? 'block' : 'hidden'
        }`}
      />

      {/* 3D WebGL Canvas Container (Available when 3D is toggled) */}
      <div
        ref={canvas3DMountRef}
        data-testid="webgl-canvas-container"
        className={`absolute inset-0 w-full h-full cursor-pointer ${
          renderMode === '3d' ? 'block' : 'hidden'
        }`}
      />

      {/* Title Screen View */}
      {gameState === 'title' && (
        <TitleScreen
          onStartGame={() => startGame()}
          onOpenLevelSelect={() => setGameState('level_select')}
          onOpenCustomizer={handleOpenCustomizer}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          renderMode={renderMode}
          onToggleRenderMode={toggleRenderMode}
        />
      )}

      {/* Level Select Modal */}
      {gameState === 'level_select' && (
        <LevelSelectModal
          levels={LEVELS}
          selectedLevelId={selectedLevelId}
          onSelectLevel={(id) => setSelectedLevelId(id)}
          onStartLevel={(id) => startGame(id)}
          onClose={() => setGameState('title')}
          progress={progress}
          isPracticeMode={isPracticeMode}
          onTogglePracticeMode={(en) => setIsPracticeMode(en)}
          cameraMode={cameraMode}
          onSelectCameraMode={handleSelectCameraMode}
          renderMode={renderMode}
          onToggleRenderMode={toggleRenderMode}
        />
      )}

      {/* Customizer Garage Modal */}
      {gameState === 'customizer' && (
        <CustomizerModal
          customization={customization}
          previewMode={customizerPreviewMode}
          onChangePreviewMode={handleChangePreviewMode}
          onUpdateCustomization={handleUpdateCustomization}
          onClose={handleCloseCustomizer}
        />
      )}

      {/* Playing HUD (Active during gameplay) */}
      {gameState === 'playing' && (
        <PlayingHUD
          levelName={currentLvl.name}
          vietnameseTitle={currentLvl.vietnameseTitle}
          songArtist={currentLvl.songArtist}
          songTrackName={currentLvl.songTrackName}
          progressPercent={progressPercent}
          attempts={attempts}
          coinsCollected={coinsCollectedCount}
          isPracticeMode={isPracticeMode}
          checkpointCount={checkpointCount}
          currentMode={currentMode}
          isMini={isMini}
          speedMultiplier={speedMultiplier}
          cameraMode={cameraMode}
          isMuted={isMuted}
          onPause={() => {
            setGameState('paused');
            sound.stopMusic();
          }}
          onPlaceCheckpoint={placeCheckpoint}
          onRemoveCheckpoint={removeCheckpoint}
          onToggleCamera={toggleCameraMode}
          onToggleMute={toggleMute}
        />
      )}

      {/* Paused Modal */}
      {gameState === 'paused' && (
        <PauseModal
          onResume={() => {
            setGameState('playing');
            sound.startMusic(currentLvl.id, currentLvl.bpm);
          }}
          onRestart={restartLevel}
          onLevelSelect={() => {
            setGameState('level_select');
            sound.stopMusic();
          }}
          isPracticeMode={isPracticeMode}
          onTogglePracticeMode={() => setIsPracticeMode(!isPracticeMode)}
          volume={volume}
          onChangeVolume={handleVolumeChange}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'gameover' && (
        <GameOverModal
          progressPercent={finalProgressPercent}
          bestPercent={finalBestPercent}
          attempts={attempts}
          isPracticeMode={isPracticeMode}
          onRestart={restartLevel}
          onLevelSelect={() => setGameState('level_select')}
          onTogglePracticeMode={() => {
            setIsPracticeMode(true);
            restartLevel();
          }}
        />
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          levelName={currentLvl.name}
          vietnameseTitle={currentLvl.vietnameseTitle}
          attempts={attempts}
          stars={currentLvl.stars}
          coinsCollected={coinsCollectedCount}
          hasNextLevel={!!nextLvl}
          onNextLevel={() => {
            if (nextLvl) startGame(nextLvl.id);
          }}
          onReplay={restartLevel}
          onLevelSelect={() => setGameState('level_select')}
        />
      )}
    </div>
  );
}
