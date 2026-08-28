import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoplayOptions {
  triggerMission: () => void;
  missionStatus: string;
  enabled?: boolean;
}

/**
 * Judge-mode autoplay hook.
 * When enabled: triggers the mission, then auto-scrolls to follow each phase.
 */
export function useAutoplay({ triggerMission, missionStatus, enabled = false }: UseAutoplayOptions) {
  const [isAutoplay, setIsAutoplay] = useState(enabled);
  const hasTriggered = useRef(false);
  const lastScrolledStage = useRef('');

  const toggleAutoplay = useCallback(() => {
    setIsAutoplay(prev => !prev);
  }, []);

  // Auto-trigger mission when autoplay is turned on and mission is idle
  useEffect(() => {
    if (isAutoplay && missionStatus === 'IDLE' && !hasTriggered.current) {
      hasTriggered.current = true;
      triggerMission();
    }
  }, [isAutoplay, missionStatus, triggerMission]);

  // Reset trigger flag when autoplay is turned off
  useEffect(() => {
    if (!isAutoplay) {
      hasTriggered.current = false;
    }
  }, [isAutoplay]);

  // Auto-scroll to follow active phase
  useEffect(() => {
    if (!isAutoplay || missionStatus === 'IDLE') return;

    // Don't re-scroll for the same stage
    if (missionStatus === lastScrolledStage.current) return;
    lastScrolledStage.current = missionStatus;

    const stageToSectionId: Record<string, string> = {
      'PLANNING': 'section-incident-panel',
      'EXECUTION': 'section-engineering',
      'VALIDATION': 'section-replan-alert',
      'REPLANNING': 'section-replan-alert',
      'RETROFIT': 'section-engineering',
      'COMPLETE': 'section-executive',
    };

    const targetId = stageToSectionId[missionStatus];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        // Small delay to let content render
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [isAutoplay, missionStatus]);

  return { isAutoplay, toggleAutoplay };
}
