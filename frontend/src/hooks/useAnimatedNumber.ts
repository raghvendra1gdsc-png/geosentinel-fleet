import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, type MotionValue } from 'framer-motion';

/**
 * Animates a numeric value from its previous state to `target`.
 * Returns a MotionValue that smoothly tweens over ~700ms.
 */
export function useAnimatedNumber(
  target: number,
  duration = 0.7
): MotionValue<number> {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 80,
    damping: 20,
    duration,
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      // First mount: snap immediately (no tween from 0)
      motionValue.set(target);
      initialized.current = true;
    } else {
      motionValue.set(target);
    }
  }, [target, motionValue]);

  return springValue;
}
