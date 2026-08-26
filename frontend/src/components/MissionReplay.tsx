import { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from 'lucide-react';
import type { MissionEvent } from '../types/mission';

interface MissionReplayProps {
  events: MissionEvent[];
  onReplayUpdate: (visibleEvents: MissionEvent[]) => void;
  onExitReplay: () => void;
}

export function MissionReplay({ events, onReplayUpdate, onExitReplay }: MissionReplayProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(events.length - 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  useEffect(() => {
    onReplayUpdate(events.slice(0, currentIndex + 1));
  }, [currentIndex]);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= events.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, events.length]);

  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentIndex((prev) => Math.min(events.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <div className="bg-surface rounded-xl border border-primary/40 p-4 shadow-xl mb-4 animate-in fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1 rounded-md bg-primary/20 text-primary text-xs font-mono font-bold border border-primary/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
            MISSION REPLAY MODE
          </div>
          <span className="text-xs text-gray-400 font-mono">
            Event {currentIndex + 1} of {events.length}
          </span>
        </div>

        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            title="Reset to Start"
            className="p-1.5 rounded-lg bg-surfaceHighlight hover:bg-gray-700 text-gray-300 text-xs transition-colors"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleStepBack}
            disabled={currentIndex === 0}
            title="Step Back"
            className="p-1.5 rounded-lg bg-surfaceHighlight hover:bg-gray-700 disabled:opacity-30 text-gray-300 text-xs transition-colors"
          >
            <SkipBack size={14} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-blue-600 text-white text-xs font-bold font-mono transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>
          <button
            onClick={handleStepForward}
            disabled={currentIndex >= events.length - 1}
            title="Step Forward"
            className="p-1.5 rounded-lg bg-surfaceHighlight hover:bg-gray-700 disabled:opacity-30 text-gray-300 text-xs transition-colors"
          >
            <SkipForward size={14} />
          </button>

          {/* Speed Toggle */}
          <button
            onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surfaceHighlight text-gray-300 text-xs font-mono hover:bg-gray-700 transition-colors"
          >
            <FastForward size={12} />
            <span>{speed}x</span>
          </button>
        </div>

        <button
          onClick={onExitReplay}
          className="text-xs text-gray-400 hover:text-white underline font-mono"
        >
          Exit Replay
        </button>
      </div>

      {/* Scrubber slider */}
      <div className="mt-3">
        <input
          type="range"
          min="0"
          max={Math.max(0, events.length - 1)}
          value={currentIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentIndex(parseInt(e.target.value, 10));
          }}
          className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  );
}
